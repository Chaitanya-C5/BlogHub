import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import nodemailer from "nodemailer";
import cloudinary from '../config/cloudinary.js'
import Post from "../models/postModel.js";

config()

const generateToken = (id, username, email) => {
  const token = jwt.sign(
    { id: id, username: username, email: email },
    process.env.JWT_SECRET , 
    { expiresIn: "7d" }
  )
  return token;
}

export const signup = async (req, res) => {
  
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is not available. Try a different one." });
    }

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id, savedUser.username, savedUser.email)

    res.status(201).json({
      message: "User created successfully",
      user: {id: savedUser._id, username: savedUser.username, email: savedUser.email},
      token,
    });
  } catch (err) {
    console.error("Error during sign-up:", err.message);
    res.status(500).json({
      message: "An error occurred while creating the user.",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id, user.username, user.email)

    res.status(200).json({
      message: "Login successful",
      user: {id: user._id, username: user.username, email: user.email},
      token,
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({
      message: "An error occurred during login",
      error: err.message,
    });
  }
};

export const getImageURL = async (profilePicture) => {
  try {
    if (!profilePicture) {
      throw new Error("No file uploaded");
    }

    const result = await cloudinary.v2.uploader.upload(profilePicture.tempFilePath, {
      asset_folder: '/profilePics',
    });

    return result.secure_url; 
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw new Error("Error uploading profile picture");
  }
}

export const updateUser = async (req, res) => {
  console.log('mid')
  const { username } = req.params
  try {
    const { following, email } = req.body;

    let updateData = {};

    if (email) {
      const existingEmail = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists. Try a different one." });
      }
      updateData.email = email;
    }

    if (req.files && req.files.profilePicture) {
      const { profilePicture: file } = req.files;
      const profilePictureUrl = await getImageURL(file); 
      updateData.profilePicture = profilePictureUrl;
    }

    if(following) {
      const currentUser = await User.findOne({ username })
      const followingUser = await User.findOne({ username: following })
      if(!currentUser || !followingUser) {
        res.status(400).json({ message: "User not found !!" })
      }
      let currentUserUpdateFields = {}, followingUserUpdateFields = {}
      if(currentUser.following.includes(following)) {
        currentUserUpdateFields = {
          $pull: { following: following }
        }
        followingUserUpdateFields = {
          $pull: { followers: username }
        }
      } else {
        currentUserUpdateFields = {
          $push: { following: following }
        }
        followingUserUpdateFields = {
          $push: { followers: username }
        }
      }

      const updatedFollowingUser = await User.findOneAndUpdate(
        { username: following },
        followingUserUpdateFields,
        { new: true }
      );

      const updatedCurrentUser = await User.findOneAndUpdate(
        { username },
        currentUserUpdateFields,
        { new: true }
      );
      console.log(updatedCurrentUser, updatedFollowingUser)

      return res.status(200).json({ message: "Profile updated successfully!", user: updatedCurrentUser });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      updateData,  
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const fetchUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password')
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let posts = await Post.find({ username })
    posts = posts.map((post) => {
      const plainPost = post.toObject();
      return { ... plainPost, profilePicture: user.profilePicture }
    })
    
    const totalPosts = posts.length
    const totalLikes = await Post.aggregate([
      { $match: { username } },
      { $group: { _id: null, totalLikes: { $sum: "$likes_count" } } },
    ]);


    const userProfile = {
      user,
      stats: {
        totalPosts,
        totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0,
      },
      posts
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchProfilePic = async (req, res) => {
  const { username } = req.user
  try {
    const user = await User.findOne({ username }).select('profilePicture')
    const { profilePicture } = user
    res.status(200).json({ profilePicture })
  } catch(error) {
    console.error("Error fetching profile picture:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        purpose: 'password_reset'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }  
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail", 
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_USER, 
        pass: process.env.APP_SECRET_KEY, 
      },
    });

    const mailOptions = {
      from: process.env.APP_USER, 
      to: email, 
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
              }
              .header {
                background-color: #007bff;
                color: #ffffff;
                text-align: center;
                padding: 20px;
                font-size: 24px;
              }
              .content {
                padding: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                color: white;
                background-color: #007bff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                padding: 10px;
                background-color: #f4f4f4;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Reset Your Password
              </div>
              <div class="content">
                <p>Dear ${user.username},</p>
                <p>We received a request to reset your password for your <strong>PostHub</strong> account. Click the button below to reset it:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>If the button doesn't work, copy and paste the following link into your browser:</p>
                <p><a href="${resetLink}" target="_blank" style="color: #007bff;">Reset Password</a></p>
                <p><strong>Note:</strong> This link is valid for only 30 minutes.</p>
                <p>If you didn’t request a password reset, you can safely ignore this email.</p>
                <p>Thank you,</p>
                <p>The <strong>PostHub</strong> Team</p>
              </div>
            </div>
          </body>
          </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (err) {
    console.error("Error during forgot password:", err.message);
    res.status(500).json({
      message: "An error occurred during login",
      error: err.message,
    });
  }
}

export const verifyResetToken = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.password = password;  
    await user.save();

    res.status(200).json({
      valid: true,
      message: "Password has been reset successfully"
    });
  
  } catch (err) {
    
    if (err instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        valid: false,
        message: "Password reset link has expired"
      });
    } else if (err instanceof jwt.JsonWebTokenError) {

      res.status(400).json({
        valid: false,
        message: "Invalid reset link"
      });
    } else {

      res.status(400).json({
        valid: false,
        message: "Error verifying reset link"
      });
    }
  }
};

export const fetchUsernames = async(req, res) => {
  try {
    const { username } = req.user
    let { category } = req.query
    category = category.toLowerCase()

    console.log(username, category)
    const users = await User.findOne({ username }).select(`${category}`)
    console.log(users)

    const results = []
    for(const user of users[`${category}`]) {
      const profileObject = await User.findOne({ username: user }).select('profilePicture')
      results.push({ username: user, profilePicture: profileObject.profilePicture })
    }
    console.log(results)
    res.status(200).json(results)
  } catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getCompleteStats = async(req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalWriters = (await Post.distinct('username')).length
    const totalBlogs = await Post.countDocuments()
    const totalLikes = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes_count" }
        }
      }
    ])

    res.status(200).json({ totalUsers, totalWriters, totalBlogs, totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0 })
  } catch(error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
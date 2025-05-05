import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js'
import nodemailer from 'nodemailer'

const fetchPosts = async (res, query, skip, limit, sortOrder) => {
    try {
        const posts = await Post.find(query,{content: 0}).skip(skip).limit(limit).sort(sortOrder).lean();

        const changedPosts = await Promise.all(
          posts.map(async (post) => {
            const postUser = await User.findOne({ username: post.username }).select('profilePicture');
            return {
              ...post,
              profilePicture: postUser ? postUser.profilePicture : null 
            };
          })
        );

        const totalCount = await Post.countDocuments(query);

        res.status(200).json({
            posts: changedPosts,
            hasMore: skip + limit < totalCount
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
};

export const fetchSinglePost = async (req, res) => {
    const postId = req.params.id;
  
    try {
      const post = await Post.findById(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const postUser = await User.findOne({ username: post.username }).select('profilePicture');
      const changedPost = {
        ...post._doc,
        profilePicture: postUser ? postUser.profilePicture : null 
      };
  
      res.status(200).json({ post: changedPost });

    } catch(err) {
      res.status(500).json({ message: 'Failed to fetch post', error: err.message });
    }
};

export const fetchFamousPosts = async (req, res) => {
    const category = req.params.category
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 2;

    const query = category === 'All' ? { likes_count: { $gt: 0 } } : { likes_count: { $gt: 0 }, category: category };
    const sortOrder = { likes_count: -1 };  

    await fetchPosts(res, query, skip, limit, sortOrder);
};

export const fetchUpdatedPosts = async (req, res) => {
  const { username } = req.user
  const category = req.params.category
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 3;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const query = category === 'All' ? { username: { $in: user.following } } : { username: { $in: user.following }, category: category };
  const sortOrder = { created_at: -1 };  

  await fetchPosts(res, query, skip, limit, sortOrder);
};

export const fetchLikedPosts = async (req, res) => {
    const category = req.params.category
    const username = req.query.user;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 2;

    try {
        const user = await User.findOne({ username }).select('liked_posts').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const paginatedLikedPostsIds = user.liked_posts.slice(skip, skip + limit);
        const query = category === 'All' ? { _id: { $in: paginatedLikedPostsIds }} : { _id: { $in: paginatedLikedPostsIds }, category: category };
        const sortOrder = { created_at: -1 }; 

        await fetchPosts(res, query, 0, 2, sortOrder); 
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
};
  
export const fetchSavedPosts = async (req,res) => {
    const category = req.params.category
    const username = req.query.user;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 2;

    try {
        const user = await User.findOne({ username }).select('saved_posts').lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const paginatedSavedPostsIds = user.saved_posts.slice(skip, skip + limit);
        const query = category === 'All' ? { _id: { $in: paginatedSavedPostsIds }} : { _id: { $in: paginatedSavedPostsIds }, category: category };
        const sortOrder = { created_at: -1 }; 

        await fetchPosts(res, query, 0, 2, sortOrder); 

    } catch(err) {
        res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
};
  
export const fetchUserPosts = async (req,res) => {
    const category = req.params.category;
    const username = req.query.user;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 3;
    
    const query = category === 'All' ? { username: username } : { username: username, category: category };
    const sortOrder = { created_at: -1, _id: -1 };
    await fetchPosts(res, query, skip, limit, sortOrder);
};

export const addPost = async (req, res) => {
  try {
    const { title, category, content, tags, visibility, username } = req.body;

    if (!title || !content || !username) {
      return res.status(400).json({ message: "Title, content, and username are required." });
    }

    const newPost = new Post({
      title,
      category: category || 'Other',
      content,
      tags,
      visibility: visibility || 'public', 
      username,
    });

    const savedPost  = await newPost.save();
    const blogLink = `${process.env.FRONTEND_URL}/login?redirect=/blogs/posts/${savedPost._id}`

    const user = await User.findOne({ username })
    const followers = user.followers
    for (const follower of followers) {
      const followerUser = await User.findOne({ username: follower });
      if (followerUser) {
        const followerMail = followerUser.email;

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
          to: followerMail,
          subject: `New Blog from ${username}!`,
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
                  New Blog Alert!
                </div>
                <div class="content">
                  <p>Hi there,</p>
                  <p><strong>${username}</strong> just published a new blog on <strong>PostHub</strong>! 🎉</p>
                  <p><strong>Title:</strong> ${title}</p>
                  <a href="${blogLink}" class="button">Read Full Post</a>
                  <p>Stay inspired and keep reading!</p>
                  <p>Thanks,</p>
                  <p><strong>The PostHub </strong></p>
                </div>
              </div>
            </body>
            </html>
          `,
        };
        
        await transporter.sendMail(mailOptions);  
        
      }
    }    

    return res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { action, payload } = req.body;

    let filter = { _id: postId };
    let updateFields = {};
    let userUpdateFields = {};
    let userName = ''

    switch (action) {
      case 'post': {
        const { title, category, content, visibility } = payload;
        if (!title || !content) {
          return res.status(400).json({ message: "Title and content are required." });
        }
        updateFields = {
          title,
          category: category || 'Other',
          content,
          visibility: visibility || 'public',
        };
        break;
      }

      case 'likes': {
        const { username } = payload;
        userName = username

        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }

        const isLiked = post.likes.includes(username);

        if (isLiked) {
          updateFields = {
            $inc: { likes_count: -1 },
            $pull: { likes: username },
          };
          userUpdateFields = {
            $pull: { liked_posts: postId },
          };
        } else {
          updateFields = {
            $inc: { likes_count: 1 },
            $push: { likes: username },
          };
          userUpdateFields = {
            $push: { liked_posts: postId },
          };
        }
        break;
      }


      case 'saves': {
        const { username: saveUser } = payload;
        userName = saveUser

        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }

        const isSaved = post.saves.includes(saveUser);

        if (isSaved) {
          updateFields = {
            $pull: { saves: saveUser },
          };
          userUpdateFields = {
            $pull: { saved_posts: postId },
          };
        } else {
          updateFields = {
            $push: { saves: saveUser },
          };
          userUpdateFields = {
            $push: { saved_posts: postId },
          };
        }
        break;
      }

      default:
        return res.status(400).json({ message: "Invalid action type." });
    }

    const updatedPost = await Post.findByIdAndUpdate(filter, updateFields, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: userName },
      userUpdateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "Post and user updated successfully", post: updatedPost });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const removePost = async (req, res) => {
  const { postId } = req.params; 

  try {
    const deletedPost = await Post.findByIdAndDelete(postId); 

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" }); 
    }

    res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

export const getSecureImageURL = async (req,res) => {
  try {

    if (!req.files) {
      throw new Error("No file uploaded");
    }

    const { image } = req.files

    const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
      asset_folder: '/blog-pics',
    });

    res.status(200).json({ imageUrl: result.secure_url })

  } catch (error) {
    throw new Error("Error uploading profile picture");
  }
}

export const getSearchResults = async(req,res) => {
  const { category, value } = req.query

  try {

    let results ;
    const regExp = new RegExp(value, 'i');

    if(category === 'username') {
      
      results = await User.find({ username: regExp }).select('username profilePicture');

    } else if(category === 'title') {

      const posts = await Post.find({ title: regExp }, { visibility: 0, content: 0 })
      results = await Promise.all(
        posts.map(async (post) => {
          const postUser = await User.findOne({ username: post.username }).select('profilePicture');
          const plainPost = post.toObject();
          return {
            ...plainPost,
            profilePicture: postUser ? postUser.profilePicture : null 
          };
        })
      ); 

    } else if(category === 'tag') {
      const posts = await Post.find({ tags: value }, { visibility: 0, content: 0 });
      results = await Promise.all(
        posts.map(async (post) => {
          const postUser = await User.findOne({ username: post.username }).select('profilePicture');
          const plainPost = post.toObject();
          return {
            ...plainPost,
            profilePicture: postUser ? postUser.profilePicture : null 
          };
        })
      );
    }
    return res.status(200).json(results);
    
  } catch (error) {
    throw new Error("Error fetching results");
  }
}
import { createUser, loginUser, updateUser } from "../models/userModel.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config ();

export const signup = async(req,res) => {
    const user = req.body;
    try {
        const result = await createUser(user);
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
};

export const login = async(req,res) => {
    const user = req.body;
    try {
        const result = await loginUser(user);
        const token = jwt.sign(
            { email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "12h" }
          );
          res.status(200).json({ token, user: result });
    } catch(err) {
        console.log(err);
        res.status(500).json({message: err.message, error: err.error});
    }
};

export const update = async(req,res) => {
    const user = req.body;
    try {
        const result = await updateUser(user);
        res.status(200).json(result);
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
}; 
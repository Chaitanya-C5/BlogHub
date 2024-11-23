import { getAllPosts, createPost, deletePost, updatePost } from '../models/postModel.js';

export const getPosts = async(req,res) => {
    const user_id = req.body.user_id;
    try {
        const posts = await getAllPosts(user_id);
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
};

export const addPost = async(req,res) => {
    try {
        const newPost = await createPost(req.body);
        res.status(200).json(newPost);
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
};

export const editPost = async(req,res) => {
    try {
        const updatedPost = await updatePost(req.body);
        res.status(200).json(updatedPost);
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
};

export const removePost = async(req,res) => {
    try {
        const newPost = await deletePost(req.body.postId);
        res.status(200).json({message: 'Successfully deleted the post.'});
    } catch(err) {
        res.status(500).json({message: err.message, error: err.error});
    }
};
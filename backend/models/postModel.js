import db from "../config/db.js";

export const getAllPosts = async (user_id) => {
    const query = `SELECT * FROM posts WHERE user_id = $1`;
    try {
        const result = await db.query(query, [user_id]);

        if (result.rows.length === 0) {
            throw new Error('No posts found');
        }

        return result.rows; 
    } catch (error) {
        console.error("Error in getAllPosts:", error.stack);
        throw new Error('Error fetching posts');
    }
};

export const createPost = async (post) => {
    const query = 'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
    try {
        const { title, content, user_id } = post;
        const result = await db.query(query, [title, content, user_id]);

        if (result.rows.length === 0) {
            throw new Error('Error creating post');
        }

        return result.rows[0]; 
    } catch (error) {
        console.error("Error in createPost:", error.stack);
        throw new Error('Error creating post');
    }
};

export const deletePost = async (postId) => {
    const query = 'DELETE FROM posts WHERE post_id = $1 RETURNING *';
    try {
        const result = await db.query(query, [postId]);

        if (result.rows.length === 0) {
            throw new Error('Post not found');
        }

        return result.rows[0]; 
    } catch (error) {
        console.error("Error in deletePost:", error.stack);
        throw new Error('Error deleting post');
    }
};

export const updatePost = async (post) => {
    const query = 'UPDATE posts SET title = $1, content = $2 WHERE post_id = $3 RETURNING *';
    try {
        const { title, content, post_id } = post;
        const result = await db.query(query, [title, content, post_id]);

        if (result.rows.length === 0) {
            throw new Error('Post not found');
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error in updatePost:", error.stack);
        throw new Error('Error updating post');
    }
};
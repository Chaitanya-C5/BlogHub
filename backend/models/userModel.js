import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const createUser = async (user) => {
    const query = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *';
    try {
        const { username, password, email } = user;
        const hashedPassword = await bcrypt.hash(password, 10); 
        const result = await db.query(query, [username, hashedPassword, email]);

        if (result.rows.length === 0) {
            throw new Error('Registration failed: Unable to insert user.');
        } 

        return result.rows[0]; 
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error('Error inserting user');
    }
};

export const updateUser = async (user_id, user) => {
    try {
        const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
        if (checkUser.rows.length > 0) {
            throw new Error("User already exists");
        }

        const query = 'UPDATE users SET username = $1, email = $2 WHERE user_id = $3 RETURNING *';
        const { username, email } = user;
        const result = await db.query(query, [username, email, user_id]);

        if (result.rows.length === 0) {
            throw new Error('Update failed: User not found or no changes applied.');
        }

        return result.rows[0];

    } catch (error) {
        console.error("Error in updateUser:", error);
        throw new Error('Error updating user');
    }
};

export const loginUser = async (user) => {
    const { email, password } = user;
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await db.query(query, [email]);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        
        const isValidPassword = await bcrypt.compare(password, result.rows[0].password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        } 
        
        return result.rows[0]; 
    } catch (error) {
        console.error("Error in loginUser:", error);
        throw new Error('Error logging in user');
    }
};

import jwt from 'jsonwebtoken';
import { config } from "dotenv";

config();

const SECRET_KEY = process.env.JWT_SECRET;

const authenticate = (req,res,next) => {

    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token) {
        return res.status(401).json({message: 'No token provided'});
    }

    try  {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch(error) {
        console.log("auth: ",error)
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default authenticate;
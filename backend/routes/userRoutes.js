import express from "express";
import authenticate from "../middleware/authenticate.js";
import { signup, login, forgotPassword, verifyResetToken, fetchUserProfile, updateUser, fetchUsernames, fetchProfilePic, getCompleteStats } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", signup);
userRoutes.post("/login", login);
userRoutes.get("/stats", getCompleteStats);
userRoutes.post("/reset-password", forgotPassword);
userRoutes.post("/set-new-password", verifyResetToken);
userRoutes.post("/profile/update", authenticate, updateUser);
userRoutes.get("/profile/:username", authenticate, fetchUserProfile);
userRoutes.get("/users", authenticate, fetchUsernames)
userRoutes.get("/user/pic", authenticate, fetchProfilePic)
userRoutes.patch("/profile/update/:username", authenticate, updateUser);
//userRoutes.patch(":username/update", authenticate, update);

export default userRoutes;
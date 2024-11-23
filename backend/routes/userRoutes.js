import express from "express";
import authenticate from "../middleware/authenticate.js";
import { signup,login, update } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.patch("/update-user", authenticate, update);

export default router;
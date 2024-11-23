import express from "express";
import authenticate from "../middleware/authenticate.js";
import { getPosts, editPost, addPost, removePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/posts", authenticate, getPosts);
router.post("/add", authenticate, addPost);
router.patch("/update", authenticate, editPost);
router.delete("/delete", authenticate, removePost);

export default router;
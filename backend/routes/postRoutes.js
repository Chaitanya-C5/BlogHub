import express from "express";
import authenticate from "../middleware/authenticate.js";
import { fetchFamousPosts, fetchLikedPosts, fetchSavedPosts, fetchUserPosts, fetchSinglePost, addPost, editPost, removePost, getSecureImageURL, getSearchResults, fetchUpdatedPosts } from "../controllers/postController.js";

const router = express.Router();

router.get('/posts/user/:category', authenticate, fetchUserPosts);
router.get("/posts/liked/:category", authenticate, fetchLikedPosts);
router.get("/posts/saved/:category", authenticate, fetchSavedPosts);
router.get("/posts/famous/:category", authenticate,fetchFamousPosts);
router.get("/posts/updates/:category", authenticate,fetchUpdatedPosts);
router.get('/posts/:id', authenticate, fetchSinglePost);
router.get('/search', authenticate, getSearchResults);
router.post("/posts/add", authenticate, addPost);
router.patch("/posts/update/:postId", authenticate, editPost);
router.delete("/posts/delete/:postId", authenticate, removePost);
router.post("/posts/imageurl", authenticate, getSecureImageURL);

export default router;
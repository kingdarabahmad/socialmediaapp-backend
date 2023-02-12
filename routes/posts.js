import express from "express"
import {getFeedPosts,getUserPosts,likePost} from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"
const router=express.Router()

// route to get all feed post that exists in database
router.get("/",verifyToken,getFeedPosts)

//route to get all the post for a particular user 
router.get("/:userId/posts",verifyToken,getUserPosts)

//route to update like to the post
router.patch("/:id/like",verifyToken,likePost)

export default router
import Post from "../models/post.js"
import User from "../models/user.js"


//create the post
export const createPost=async(req,res)=>{
    try {
        //destructure the below property from req body object
        const {userId,description,picturePath}=req.body

        //find the user from database 
        const user= await User.findById(userId)

        //now create the new post in database
        const newPost= new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save()

        //now find all the post present in the db
        const post= await Post.find().sort({updatedAt:-1})
        res.status(201).json(post)

    } catch (error) {
        res.status(409).json({error:error.message})
    }
}

// get all posts from db

export const getFeedPosts=async(req,res)=>{
    try {
        const post = await Post.find().sort({updatedAt:-1})
        res.status(200).json(post)

    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

//get all posts of for a particular user

export const getUserPosts=async(req,res)=>{
    try {
        const {userId}=req.params
        const post = await Post.find({userId})
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

// update like on post

export const likePost=async(req,res)=>{
    try {
        const {id}=req.params
        const {userId}=req.body
        const post = await Post.findById(id)

        //post.likes is a Map dataStructure to get value for particular userId we use get() method
        const isLiked= post.likes.get(userId)
        if(isLiked){
            post.likes.delete(userId)
        }
        else{
            post.likes.set(userId,true)
        }
        const updatedPost= await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new:true}
        )

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

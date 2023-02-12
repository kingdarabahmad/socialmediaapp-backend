import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/user.js";
import Post from "./models/post.js";
import { users,posts } from "./data/index.js";

// Configurations
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
dotenv.config()
const app=express()
app.use(helmet())
app.use(express.json())
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use("/assets",express.static(path.join(__dirname,'public/assets')))
app.use(cors())

//handle File Storage

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/assets');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})  
const upload=multer({storage})


//Routes with files
app.post("/auth/register",upload.single('picture'),register)
app.post("/posts",verifyToken,upload.single('picture'),createPost)

//Routes
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

//mongoose setup

const PORT= process.env.PORT || 6001;
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`server running on ${PORT}`)
    })

    //below command to add demo data to user and post collections
    // User.insertMany(users)
    // Post.insertMany(posts)
})
.catch((error)=>console.log(error))

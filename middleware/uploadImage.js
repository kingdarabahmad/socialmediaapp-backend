import {storage} from "../config/firebaseConfig.js"
import { getDownloadURL, ref,uploadBytes } from "firebase/storage";


export const uploadImage=async(req,res,next)=>{
    try {
        const {file}=req
        const storageRef=ref(storage,`images/${file?.originalname}`)
        const data= await uploadBytes(storageRef,file.buffer)
        const imageUrl= await getDownloadURL(data.ref)
        console.log(imageUrl)
        req.body={
            ...req.body,
            picturePath:imageUrl
        }
        next()   
    } catch (error) {
        res.send({msg:error.message})
    }
}
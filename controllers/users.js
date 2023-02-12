import User from "../models/user.js";

//Read------> get user data from db for specific id
export const getUser= async(req,res)=>{
    try {
        const {id}= req.params
        const user = await User.findById(id).select('-password')
        res.status(200).json(user)
        
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

//Read------> get users friends from db for specific user Id

export const getUserFriends=async(req,res)=>{
    try {
        const {id}= req.params
        const user = await User.findById(id)
        //from the found user object there is a friends property which contain all user id in an array which are friends of found user .now apply map function in that array that will find  the details of all friends of user 
        const friends= await Promise.all(
            user.friends.map((id)=>User.findById(id))
        )
        const formattedFriends=friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>({_id,firstName,lastName,occupation,location,picturePath}))

        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

//Update------>add or remove particular friends from the particular user and then send all friends data

export const addRemoveFriend=async(req,res)=>{
    try {
        const {id,friendId}=req.params
        //find user with the current id
        const user= await User.findById(id)
        
        //find friend from the user collection
        const friend= await User.findById(friendId)

        if(user.friends.includes(friendId)){
            user.friends=user.friends.filter((id)=>id!==friendId)
            friend.friends=friend.friends.filter((id)=>id!==id)
        }
        else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()
        const friends= await Promise.all(
            user.friends.map((id)=>User.findById(id))
        )
        const formattedFriends=friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>({_id,firstName,lastName,occupation,location,picturePath}))

        res.status(200).json(formattedFriends)        
        
    } catch (error) {
        
    }
}
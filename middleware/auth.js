import jwt from "jsonwebtoken"

export const verifyToken= async(req,res,next)=>{
    try {
        let token
        const {authorization}=req.headers
        if(!authorization) return res.status(403).send("Access denied")
        if(authorization.startsWith("Bearer")){
            token=authorization.split(" ")[1]
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET)
        req.user=verified;
        next()
    } catch (error) {
        res.status(500).send({error:error.message})
    }

}
import jwt from "jsonwebtoken";
import userModel from "../model/User/users.js";


export const checkUserAuth = async(req, res, next)=>{
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]

            // Verify Token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(userID,'------->userid');
            // Get User from Token
            req.user = await userModel.findById(userID).select('-password')
            next();
        } catch (error) {
            console.log(error)
            res.status(401).send({ "status":"failed", "message":"Unauthorized User" })
        }
    }
    if (!token) {
        res.status(401).send({ "message": "Unauthorized User, No Token" })
    }
}


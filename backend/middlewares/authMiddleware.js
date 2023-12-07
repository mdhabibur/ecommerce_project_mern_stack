import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'


//used must be authenticated to access private routes like 'get his profile' or 'update profile'

const protect = asyncHandler(async (req,res,next) => {
    let token;

    //Read JWT from 'jwt' cookie //cookie name was 'jwt'
    token = req.cookies.jwt;

    if(token){
        try{
            //got the jwt token , now by decoding get the 'user id' from it
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //now pass that user id for every user request so that user id can be taken
            req.user = await User.findById(decoded.userId).select("-password");
            //password is not needed, only user id
            //then call the next middleware
            next();

        }catch(error){
            console.error(error);
            res.status(401);
            throw new Error("not authorized, token failed");
        }
    }else{
        res.status(401);
        throw new Error('not authorized, no token');
    }


});

//not for some url/requests like 'get all users', 'delete user' , an user must be authorized as 'admin'

const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("not authorized as admin")
    }
};

export {protect,admin};
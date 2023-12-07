import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {


const token = jwt.sign({userId: userId}, process.env.JWT_SECRET, {
    expiresIn: '30d'
})
//using json web token for user auth that can be set to access private requests by passing then with request as http-only cookie. json web token has three parts: 1.header 2.user stored data 3. signature/validation

//set JWT as http-only cookie
res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', //user secure cookie in production only
    sameSite: 'strict', //prevent the CSRF attacks
    maxAge: 30*24*60*60*1000, //30 days

});

};

export default generateToken;






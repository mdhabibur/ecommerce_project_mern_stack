import path from 'path';
import express from "express";
import products from "./data/products.js";
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound,errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'
import multer from 'multer'


const app = express();
//configuring before using any env variables
dotenv.config()

//connect to mongoDB 
connectDB()

const port = process.env.PORT || 5000

//body parser middlewares
//for parsing raw body data sent from user
app.use(express.json())
//for parsing url encoded data
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//productRoutes
app.use("/api/products", productRoutes);
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes);

//exceptional (because was not working, that's whey this syntax)
app.use('/orders/api/orders', orderRoutes)

//route to get access of PAYPAL_CLIENT_ID from frontend as we will not store it to frontend so that user's or others can get access to it
app.get('/orders/api/config/paypal', (req,res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

//exceptional (because was not working, that's whey this syntax) : for admin: 
//though we send get request through 'ORDERS_URL' , means 'api/orders' but somehow the 'get request is being: /admin/api/orders
//so need to handle this route:
app.use('/admin/api/orders', orderRoutes)

//for uploading product image
app.use('/api/upload', uploadRoutes)

//now the product image will be uploaded here in the server withing the 'uploads' folder so need to make the 'uploads' folder static 

//admin to users functionality
app.use('/admin/api/users', userRoutes)


//get and update users from admin panel
//because 
app.use('/admin/user', userRoutes)

//handling product image upload when editing and updating product
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));



//we don't want react dev server for our production mode. we want root of our application to build the production version

if(process.env.NODE_ENV === 'production'){
    //set static folder for build
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    //any route that is not api (means the above ones) will be redirected to index.html that is inside the '/frontend/build/index.html'
    app.get('*', (req,res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )


}else{
    //if not in production mode, then use react dev server
    app.get("/", (req, res) => {
        res.send("Api is running...");
    });
    
}







//use the error handler
app.use(notFound)
app.use(errorHandler)


//start the node js server
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)

});

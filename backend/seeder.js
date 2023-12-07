import colors from 'colors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'



//configuring dotenv
dotenv.config()

//connecting to mongodb
connectDB()


const importData =  async () => {

    try{
        //first remove all data from db
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()


        const newUser = await User.insertMany(users)
        const admin = newUser[0]._id


        const productSampleData = await products.map((product) => {
            return {...product, user:admin}
        })

        await Product.insertMany(productSampleData)

        console.log('data inserted'.green.inverse)
        process.exit()


    }catch(error){
        console.log(`${error.message}`.red.inverse)
        process.exit(1)

    }

}


const destroyData = async () => {
    try{
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()

        console.log('data destroyed'.green.inverse)
        process.exit()

    }catch(error){
        console.log(`${error.message}`.red.inverse)
        process.exit(1)
    }
}


/*
//for accessing the command lines commands from the scripts
console.log(process.argv)
console.log(process.argv[2])

*/

if(process.argv[2] === '-d'){
    destroyData()

}else{
    importData()
}
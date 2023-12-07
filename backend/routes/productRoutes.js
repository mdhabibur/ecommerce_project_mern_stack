import express from 'express'
import mongoose from 'mongoose';
import { createProduct, createProductReview, deleteProduct, getAllProducts,getProductById, getTopProducts, updateProduct } from '../controllers/productController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';
import uploadRoutes from './uploadRoutes.js'


const router = express.Router()


router.route('/').get(getAllProducts).post(protect, admin, createProduct)
router.get('/top', getTopProducts)

router.route('/:id')
    .get(getProductById)
    .put(protect,admin, updateProduct)
    .delete(protect, admin, deleteProduct)

//exceptional
// router.route('/:id/api/upload').put(protect,admin, uploadRoutes)

//for product reviews
router.route('/:id/reviews').post(protect, createProductReview)





export default router
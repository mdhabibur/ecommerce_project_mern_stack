import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc  Fetch all products
// @route GET /api/products
// @access public
const getAllProducts = asyncHandler( async (req, res) => {
  // const products = await Product.find({})
	// res.json(products);

  //now we will add pagination system to product page and display 4 items per page
  const pageSize = 4 //items per page
  const page = Number(req.query.pageNumber) || 1 //current page

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i', //for case insensitive
    }
  } : {} ;



  const count = await Product.countDocuments( { ...keyword })
  //gives total products object/documents

  const products = await Product.find({...keyword}).limit(pageSize)
                         .skip(pageSize * (page - 1))
  //skip will display only the products that are not in the previous pages

  res.json({ products, page, pages: Math.ceil(count / pageSize )})

  //sends products to display in current page, current page and total page no



})


//@desc Fetch single product
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler( async (req, res) => {
        const product = await Product.findById(req.params.id)
        if(product){
           return res.json(product)
        }else{
            res.status(404)
            throw new Error('Resource Not Found')
        }
        
       
    })


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '../../frontend/public/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    });
  
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  });


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

  const updateProduct = asyncHandler(async (req, res) => {

    const {name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct)

    }else {
        res.status(404)
        throw new Error('Product Not found to be updated')
    }


  })


// @desc    delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id)

  if(product) {

      await Product.deleteOne({_id: product._id})
      res.status(200).json({message: 'Product removed '})

  }else {
      res.status(404)
      throw new Error('Product Not found to be deleted')
  }


})


// @desc    create new review
// @route   POST /api/products/:id/reviews
// @access  Private

const createProductReview = asyncHandler(async (req, res) => {

  //first get the rating and comment from the user posted review
  const {rating, comment} = req.body

  const product = await Product.findById(req.params.id)

  if(product) {
      //will not allow multiple reviews for same product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString() )
        //means the logged in user has already a review on that product

      if(alreadyReviewed){
        res.status(400)
        throw new Error("Product already reviewed")
      }

  //now post the review to db
  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
    user: req.user._id,
  };

  //post the review
  product.reviews.push(review)

  //set number of reviews
  product.numReviews = product.reviews.length 

  //set rating of that product
  product.rating = product.reviews.reduce( (acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save()

  res.status(201).json({message: 'Review added'})


  }else {
      res.status(404)
      throw new Error('Product Not found to be reviewed')
  }


})


//@desc Get top rated products
//@route GET /api/products/top
//@access public

const getTopProducts = asyncHandler( async (req, res) => {

  const products = await Product.find({}).sort({rating: -1}).limit(3);
  //sort top 3 products by highest ratings

  res.json(products)
  
 
})


export {
  getAllProducts,
  getProductById,
  createProduct, 
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  

}
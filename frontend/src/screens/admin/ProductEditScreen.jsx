import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productApiSlice'
import FormContainer from '../../components/FormContainer'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

const ProductEditScreen = () => {

    //first fetch the product id from search query
    const {id: productId} = useParams()

    //set the states
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    //now the the product details by productId from db through getProductDetails query endpoint
    const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId)


    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation()

    //now update the states to set the form fields with corresponding data fetched from db when the screen loads for the first time
    useEffect( () => {
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);

        }
    },[product])


    const navigate = useNavigate()
    
    //now to update the product fields 
    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation()

    const submitHandler = async (e) => {

        e.preventDefault()

        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock,

            })

            toast.success('product updated successfully')
            refetch()
            navigate('/admin/productList')
            
        } catch (err) {
            toast.error(err?.data?.message || err.error)
            
        }

    }


    //image upload handler  
    const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

      // formData.append('image', e.target.files[0])
      // console.log(e.target)
      // console.log(e.target.files);
      // console.log(e.target.files[0])
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }

  };



  return (
    <>
    <Link to='/admin/productList' className='btn btn-light my-3'>
        Go Back
    </Link>


    <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler} encType='multipart/form-data'>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* IMAGE INPUT PLACEHOLDER */}
            <Form.Group controlId='image'>

              <Form.Label>Image</Form.Label>
              <Form.Control type='text' placeholder='Enter Image Url'
                    value={image} onChange={(e) => setImage(e.target.value)}
              ></Form.Control>

         

              <Form.Control 
                  Label="Choose File"
                  name='image'
                  onChange={uploadFileHandler}
                  type='file'
                  ></Form.Control>

              {loadingUpload && <Loader />}

            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>


    
    </>

    
  )


}

export default ProductEditScreen
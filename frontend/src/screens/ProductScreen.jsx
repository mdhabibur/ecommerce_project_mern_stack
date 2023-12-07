import React, { useEffect, useState } from 'react'
import {useParams,Link,useNavigate} from 'react-router-dom'
import {Row,Col, Button, ListGroup, ListGroupItem,Image, Card,Form} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating.jsx'
import { useCreateReviewMutation, useGetProductDetailsQuery } from '../slices/productApiSlice.js'
import Loader from '../components/Loader.jsx'
import Message from '../components/Message.jsx'
import { addToCart } from '../slices/cartSlice.js'
import { toast } from 'react-toastify'
import Meta from '../components/Meta.jsx'

const ProductScreen = () => {
    const {id: productId} = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const {data:product, isLoading, error, refetch} = useGetProductDetailsQuery(productId)

    //got the logged in user info from auth state
    const {userInfo} = useSelector( (state) => state.auth)

    //when creating review in database , to show loader component we will need this isLoading state
    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()


    const addToCartHandler = () => {
        dispatch(addToCart({...product,qty}))
        navigate('/cart')

    }

    const submitHandler = async (e) => {
        e.preventDefault()

        try{
            await createReview({
                productId,
                rating: rating,
                comment: comment,
            }).unwrap()
            //reload the page, because the 'product' is updated with 'ratings',numReviews, and reviews[]
            refetch()
            toast.success('Review created successfully')
            setRating(0)
            setComment('')
        }catch(err){
            toast.error(err?.data?.message || err.error)
        }

    }


  return (
    <>
    <Link to='/'> <Button className='btn btn-light my-3'>Go Back</Button></Link>

    {isLoading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error?.data.message || error.error}</Message>
    ) : ( <> 

    <Meta title={product.name} description={product.description} />
    {/* //for displaying product name as tab window title through this meta component */}

        <Row>
            <Col md={5} >
            <Image src={product.image} alt={product.image} fluid />
            </Col>

            <Col md={4}>
                <ListGroup >
                    <ListGroupItem><h4>{product.name}</h4></ListGroupItem>
                    <ListGroupItem>
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    </ListGroupItem>
                    <ListGroupItem>Price : ${product.price}</ListGroupItem>
                    <ListGroupItem>Description: {product.description}</ListGroupItem>

                </ListGroup>


            </Col>

            <Col md={3}>

                <Card>
                    <ListGroup variant='flush'>

                        <ListGroupItem>
                            <Row>
                                <Col>Price:</Col>
                                <Col><strong>${product.price}</strong></Col>
                            </Row>
                        </ListGroupItem>

                        <ListGroupItem>
                            <Row>
                                <Col>Status:</Col>
                                <Col><strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock' }</strong></Col>
                            </Row>

                        </ListGroupItem>

                        {/* Quantity Select  */}
                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                     Qty
                                    </Col>

                                    <Col>
                                    <Form.Control 
                                    as='select'
                                    value={qty}
                                    onChange = {(e) => setQty(Number(e.target.value))}
                                    >
                                        {[...Array(product.countInStock).keys()].map(
                                            (x) => (
                                                <option key={x+1} value={x+1}>
                                                    {x+1}
                                                </option>
                                            )
                                        )}


                                    </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}



                        <ListGroupItem>
                        <Button type='button' className='btn btn-block' disabled={product.countInStock===0}
                        onClick={addToCartHandler}
                        >
                        Add To Cart
                        </Button>

                        </ListGroupItem>

                    </ListGroup>


                </Card>



            </Col>

        </Row>

        <Row className='review'>

            <Col md={6}>
                <h2>Reviews</h2>

                {product.reviews.length === 0 && <Message>No Reviews </Message>}
                
                <ListGroup variant='flush'>

                    {product.reviews.map( (review) => (
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name} </strong>
                            <Rating value={review.rating} />
                            <p>{review.createdAt.substring(0,10)} </p>
                            <p>{review.comment} </p>

                        </ListGroup.Item>

                    ) )}
                </ListGroup>


                <ListGroup.Item>
                    <h2>Write a Customer Review</h2>

                    {loadingProductReview && <Loader />}

                    {/* only logged in user can post review  */}

                    {userInfo ? (
                        <Form onSubmit={submitHandler}>

                            <Form.Group className='my-2' controlId='rating'>
                                <Form.Label>Rating</Form.Label>
                                <Form.Control as='select' required
                                      value={rating}
                                      onChange={ (e) => setRating(e.target.value)} >
                                        <option value=''>Select...</option>
                                        <option value='1'>1 - Poor</option>
                                        <option value='2'>2 - Fair</option>
                                        <option value='3'>3 - Good</option>
                                        <option value='4'>4 - Very Good</option>
                                        <option value='5'>5 - Excellent</option>

                                      </Form.Control>

                            </Form.Group>

                            <Form.Group className='my-2' controlId='comment'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                            as='textarea'
                            row='3'
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                             </Form.Group>

                             <Button
                            disabled={loadingProductReview}
                            type='submit'
                            variant='primary'
                             >
                            Submit
                             </Button>

                        </Form>

                    ) : (

                        //else tell to login
                        <Message >
                            Please <Link to='/login'>sign in</Link> to write a review
                        </Message>


                    )}


                </ListGroup.Item>

                
            </Col>

        </Row>
        
        </>

        )}


    
    </>
  )
}

export default ProductScreen
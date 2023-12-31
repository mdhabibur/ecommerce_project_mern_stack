import React from 'react'
import { useState } from 'react'
import {Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../slices/cartSlice'


import CheckoutSteps from '../components/CheckoutSteps'



const ShippingScreen  = () => {

    //first retrieve the saved shipping address for cart object from localhost and use them as initial default field value

    const cart = useSelector((state) => state.cart)
    const {shippingAddress} = cart 


    //now work with state
    // const [address, setAddress] = useState(shippingAddress.address || '')
    //but for the first time shippingAddress.address will be undefined , so need to use this syntax to handle undefined values:
    const [address, setAddress] = useState(shippingAddress?.address || '')
    const [city, setCity] = useState(shippingAddress?.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
    const [country, setCountry] = useState(shippingAddress?.country || '')


    const dispatch = useDispatch()
    const navigate = useNavigate()


    const submitHandler = (e) => {
        e.preventDefault()
        //now call the saveShippingAddress() reducer function using dispatch() hook
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        //and navigate to 'payment' route
        navigate('/payment')

    };





  return (

    <FormContainer>

    <CheckoutSteps step1 step2 />

    <h1>Shipping</h1>

    <Form onSubmit={submitHandler}>
      <Form.Group className='my-2' controlId='address'>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter address'
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group className='my-2' controlId='city'>
        <Form.Label>City</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter city'
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group className='my-2' controlId='postalCode'>
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter postal code'
          value={postalCode}
          required
          onChange={(e) => setPostalCode(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group className='my-2' controlId='country'>
        <Form.Label>Country</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter country'
          value={country}
          required
          onChange={(e) => setCountry(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Button type='submit' variant='primary'>
        Continue
      </Button>
    </Form>
  </FormContainer>
   


  )


}

export default ShippingScreen 
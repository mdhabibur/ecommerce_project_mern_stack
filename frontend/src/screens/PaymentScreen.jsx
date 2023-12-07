import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { Button, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../slices/cartSlice'




const PaymentScreen = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const cart = useSelector( (state) => state.cart)
    const {shippingAddress } = cart

    //if used did not put shipping address and went to payment page, redirect them to '/shipping'
    useEffect(() => {
        if(!shippingAddress.address){
            navigate('/shipping')
        }
    },[navigate,shippingAddress])

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    const submitHandler = (e) => {
        e.preventDefault()
        //save the paymentMethod to local storage
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }



  return (

    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>Payment Method</h1>

        <Form onSubmit={submitHandler} >

            <Form.Group >
                <Form.Label as='legend'>Select Method </Form.Label>
                <Col>
                <Form.Check 
                   className='my-2'
                   type='radio'
                   label='PayPal or Credit Card'
                   id='PayPal'
                   name='paymentMethod'
                   value='PayPal'
                   checked
                   onChange={(e) => setPaymentMethod(e.target.value)}
                   ></Form.Check>
                
                </Col>

            </Form.Group>

            <Button type='submit' variant='primary'>Continue</Button>

        </Form>

    </FormContainer>


  )
}

export default PaymentScreen
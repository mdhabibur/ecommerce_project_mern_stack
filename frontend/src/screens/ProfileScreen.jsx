import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/userApiSlice';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {FaTimes} from 'react-icons/fa'

const ProfileScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    
    
    const [updateProfile, {isLoading: loadingUpdateProfile}] = useProfileMutation()

    const {data: orders, isLoading, error} = useGetMyOrdersQuery()

    //set the name and email filed with the default name and email when the page loads for the first time
    useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
    },[userInfo, userInfo.name, userInfo.email])

    const dispatch = useDispatch()

    const submitHandler = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
      } else {
        try {
          const res = await updateProfile({
            _id: userInfo._id,
            name,
            email,
            password,
          }).unwrap();
          dispatch(setCredentials({ ...res }));
          //also update to local host
          toast.success('Profile updated successfully');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    };


  return (

    <Row>
        <Col md={3}>

            
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>


        </Col>

        <Col md={9}>

          <h2>My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error }</Message>

          ): (
            <Table striped table hover responsive className='table-sm'>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>DATA</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>

              </thead>

              <tbody>

                {orders.map( (order) => (

                  <tr key={order._id}>

                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0,10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>{order.isPaid ? (
                       order.paidAt.substring(0,10)
                    ): (
                      //show cross line
                      <FaTimes style={{ color: 'red' }} />

                    )}
                    </td>
                    <td>{order.isDelivered ? (
                      order.deliveredAt.substring(0,10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />

                    )}
                    
                    </td>

                    <td>
                      <LinkContainer to={`/orders/${order._id}`}>
                        <Button className='btn-sm'>
                          Details
                        </Button>
                      </LinkContainer>
                    </td>



                  </tr>
                ))}


              </tbody>



            </Table>

          )
        }


        </Col>
    
        
    </Row>

  
  )

}

export default ProfileScreen
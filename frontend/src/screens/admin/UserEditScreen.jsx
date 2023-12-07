import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetUsersDetailsQuery, useUpdateUserMutation } from '../../slices/userApiSlice'
import FormContainer from '../../components/FormContainer'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'


const UserEditScreen = () => {

    const {id: userId} = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const {data: user, isLoading, error, refetch} = useGetUsersDetailsQuery(userId)

    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation()

    const navigate = useNavigate()

    useEffect( () => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }

    }, [user]);


    const submitHandler = async (e) => {
        e.preventDefault()
        
        try{
            await updateUser({userId, name, email, isAdmin})
            toast.success('user updated successfully')
            refetch()
            navigate('/admin/userList')
        }catch(err){
            toast.err(err?.data?.message || err.error)

        }


    }




  return (
    <>

      <Link to='/admin/userList' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>

        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>{error?.data?.message || error.error }</Message>
        ) : (
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

            <Form.Group className='my-2' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>


            </Form>

        )}

      </FormContainer>

    
    </>

  )
}

export default UserEditScreen
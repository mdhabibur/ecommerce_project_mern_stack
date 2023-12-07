import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


//this component will display 'checkout steps component/component tree' from 'sign In=>shipping=>payment=>place-order" these 4 steps and each component will display all the steps to the current component

//ex: if the user is in shipping screen/component, the 'it will count as step1, and step2' and the component tree will be sign in => shipping

const CheckoutSteps = ( {step1, step2, step3, step4 }) => {
  return (

    <Nav className='justify-content-center mb-4'>

        <Nav.Item>
            {step1 ? (
                <LinkContainer to='/login'>
                    <Nav.Link>Sign In</Nav.Link>
                </LinkContainer>
            ) : (

                <Nav.Link disabled>Sign In</Nav.Link>
            )}

        </Nav.Item>


        <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>




    </Nav>
    
  )
}

export default CheckoutSteps
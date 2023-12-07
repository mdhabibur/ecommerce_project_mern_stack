import React, { useEffect } from 'react'
import { useDeliverOrderMutation, useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from '../slices/orderApiSlice'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const OrderScreen = () => {

    const {id} = useParams();
    //retrieve the 'order details' of specific order by using 'getOrderById' order controller method of backend where 'user's name and email' also been populated along wil order details and this method is called as useGetOrderDetailsQuery() from frontend
    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(id)
    //got the order details of the order , now show them here
    console.log("id: ", id)

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation()
    const {userInfo} = useSelector((state) => state.auth)
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation()

    const {
        data: paypal,
        isLoading: loadingPayPal,
        error: errorPayPal,

    } = useGetPaypalClientIdQuery()


    useEffect(() => {
        //loadPaypalScript if there is no error and loading
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                      'client-id': paypal.clientId,
                      currency: 'USD',
                    },
                  });
                  paypalDispatch({type: 'setLoadingStatus', value: 'pending'})
                
            }
            //if order is not paid , then again load the loadPaypalScript and also if it is already not opened
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPaypalScript()
                }
            }

        }
    }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch])

    //handling payment with paypal

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
          try {
            await payOrder({ id, details });
            refetch();
            //reloading the page
            toast.success('Order is paid');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        });
      }


      //this method is for testing purpose to check if when 'Test Pay Order' button is clicked, 'isPaid' is set true and page is reloaded with 'success' toast
      //not needed in production mode

      async function onApproveTest() {
        await payOrder({ id, details: { payer: {} } });
        refetch();
    
        toast.success('Order is paid');
      }

      

      function onError(err) {
        toast.error(err.message);
      }
    

      //paypal handling the amount of order to be paid from user account
      function createOrder(data, actions) {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: { value: order.totalPrice },
              },
            ],
          })
          .then((orderID) => {
            return orderID;
          });
      }

    

    //deliver handler to 'mark the product as delivered'
    const deliverHandler = async () => {
        await deliverOrder(id)
        //refresh the screen
        refetch()
    }



    return (
        isLoading? (
            <Loader />
        ): error ? (
            <Message variant='danger'/>
        ):
        (
            <>

            <h1>Order {order._id}</h1>
                <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                        <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                        <strong>Email: </strong>{' '}
                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                        <strong>Address:</strong>
                        {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                        {order.shippingAddress.postalCode},{' '}
                        {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                        <Message variant='success'>
                            Delivered on {order.deliveredAt}
                        </Message>
                        ) : (
                        <Message variant='danger'>Not Delivered</Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                        <strong>Method: </strong>
                        {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                        <Message variant='success'>Paid on {order.paidAt}</Message>
                        ) : (
                        <Message variant='danger'>Not Paid</Message>
                        )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? (
                        <Message>Order is empty</Message>
                        ) : (
                        <ListGroup variant='flush'>
                            {order.orderItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                <Col md={1}>
                                    <Image
                                    src={item.image}
                                    alt={item.name}
                                    fluid
                                    rounded
                                    />
                                </Col>
                                <Col>
                                    <Link to={`/product/${item.product}`}>
                                    {item.name}
                                    </Link>
                                </Col>
                                <Col md={4}>
                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                </Col>
                                </Row>
                            </ListGroup.Item>
                            ))}
                        </ListGroup>
                        )}
                    </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                        <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                        </ListGroup.Item>


                        {/* PAY ORDER PLACEHOLDER */}
                        {/* PAY ORDER PLACEHOLDER */}
                        {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader />}

                            {isPending ? (
                            <Loader />
                            ) : (
                            <div>

                                <Button
                                style={{ marginBottom: '10px' }}
                                onClick={onApproveTest}
                                >
                                Test Pay Order
                                </Button>
                                

                                <div>
                                <PayPalButtons
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={onError}
                                ></PayPalButtons>
                                </div>
                            </div>
                            )}
                        </ListGroup.Item>
                        )}

                        {/* {MARK AS DELIVERED PLACEHOLDER} */}
                        {isLoading && <Loader />}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button 
                                type='button'
                                className='btn btn-block'
                                onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}



                    </ListGroup>
                    </Card>
                </Col>
                </Row>
            </>
        )
    )



};

export default OrderScreen
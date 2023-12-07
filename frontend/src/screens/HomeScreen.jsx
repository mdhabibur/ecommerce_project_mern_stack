import { Row,Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link, useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'


const HomeScreen = () => {

  const {pageNumber, keyword } = useParams()

  const {data, isLoading, error}  = useGetProductsQuery({keyword, pageNumber})
  //useGetProductQuery endpoints return the data,loading state and error state
  //now need to handle the 'individual product' using react-redux


  return (
    <>

    {!keyword ? (
      <ProductCarousel />
    ) : (
      <Link to='/' className='btn btn-light'>Go Back</Link>
    )}

    {isLoading ?
     (<Loader />) : error? (
     <Message variant='danger'>{ error?.data.message || error.error }</Message>
     ) :
      (
        <> 

        <Meta />
        {/* //For displaying custom title on the tab window  */}

        <h1>Latest Products</h1>
            <Row >

            {
                data.products.map( (product) => {

                    return (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    )

                })
            }
            </Row>

            <Paginate pages={data.pages} page={data.page} keyword = {keyword ? keyword : ''} />
        </>

      )}

    
    </>

  )
}

export default HomeScreen
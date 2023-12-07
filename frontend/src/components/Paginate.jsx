import { Pagination } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"


const Paginate = ({pages, page, isAdmin = false, keyword = ''}) => {

    return (
        pages > 1 && (

            <Pagination>

                {[...Array(pages).keys()].map( (x) => (
                    //using Array() constructor to get the pages from 0 to ... using keys() and then mapping through the pages starting from 0...
                    //and for each page , setting a link to take to that page and setting the key to 1 base, that's why {x + 1} and also setting active item

                    <LinkContainer
                        key={x + 1}
                        to={!isAdmin ? keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}` : `/admin/productList/${x + 1}` }
                        >

                            <Pagination.Item active={x + 1 === page} > {x + 1 } </Pagination.Item> 

                        </LinkContainer>

                        //this Paginate Component is only for displaying 1,2,3,,, pagination number on the bottom on page, it does not do any functionality, rather when clicked , it takes to a route => 

                        //when not admin, it takes to , '/page/:pageNumber' route and when
                        //when admin it takes to '/admin/productList/:pageNumber' route and

                        //then in frontend, it goes to 'getProducts' api query inside 'productApiSlice' which sends the request to backend with the 'pageNumber' as params

                        //In backend, when 'getProducts' controller is Called, it first gets the pageNumber from the frontend api request, gets the specified 4 products per page and sends the 4 products with current page no and total page no as json response which is again used on frontend to display the products.




                )
            ) }


            </Pagination>

        )


    )



}

export default Paginate;
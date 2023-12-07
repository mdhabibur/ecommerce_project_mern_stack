import { apiSlice } from "./apiSlice";
import { ORDERS_FETCH_CORRECT_URL, ORDERS_URL, PAYPAL_URL } from "../constants";


export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body:{...order},
            })
        }),
        //getOrderDetails() is a 'GET' method, and no change in the data of database, so no mutation, only querying with the order 'id' passed in 'url'
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}`,
                method: "GET",
            }),
            keepUnusedDataFor: 5,
            //for 5 sec
        }),
        payOrder: builder.mutation({
            query: ({id, details}) => ({
                url: `${ORDERS_URL}/${id}/pay`,
                method: 'PUT',
                body: {...details},
            })
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL,

            }),
            keepUnusedDataFor: 5
        }),

        getMyOrders: builder.query({
            query: () => ({
                url: `${ORDERS_URL}/mine`
            }),
            keepUnusedDataFor: 5,
        }),
        
        getOrders: builder.query({
            query: () => ({
                url: ORDERS_URL,
            }),
            keepUnusedDataFor: 5,
        }),

        deliverOrder: builder.mutation({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}/deliver`,
                method: 'PUT',
            })
        }),
        


    })
})


export const {useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation} = orderApiSlice
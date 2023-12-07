import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const productApiSlice = apiSlice.injectEndpoints({
    //will inject endpoints to apiSlice from here
    endpoints: (builder) => ({
        //builder object has query object for querying 
        getProducts: builder.query({
            //getProducts is the 'endpoint' which hits the 'PRODUCT_URL' Inside the query()
            query: ({keyword, pageNumber }) => ({
                url: PRODUCTS_URL,
                params: {keyword, pageNumber },

            }),
            keepUnusedDataFor: 5,
            // providesTags: ['Product'],
            //for reloading purpose and this tag should be provided when need to fetch all products 
        }),
        getProductDetails: builder.query({
            query:(productId) => ({
                url: `${PRODUCTS_URL}/${productId}`
            }),
            keepUnusedDataFor: 5,
        }),

        createProduct: builder.mutation({
            query: () => ({
                url: `${PRODUCTS_URL}`,
                method: "POST"
            }),
            invalidatesTags: ['Product'],
            //for reloading purpose and this tag should be provided when need to fetch all products 
        }),
        
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            //here also need to invalidate the caches 
            invalidatesTags: ['Product']
        }),

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `/api/upload`,
                method: 'POST',
                body: data,
            })
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE',
            }),
            providesTags: ['Product'],
        }),

        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

        getTopProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`,
            }),
            keepUnusedDataFor: 5,
        })




    }) 

})


export const {useGetProductsQuery,
    useGetProductDetailsQuery, 
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    

    } = productApiSlice
// this is the convention here to export the 'getProducts' by this 'useGetProductsQuery'
// using 'use' before the keyword and 'Query' after it
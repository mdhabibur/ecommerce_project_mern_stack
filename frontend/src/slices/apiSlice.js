import {fetchBaseQuery, createApi} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from "../constants"

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({})
    //we will inject the endpoints here from other files but we can directly use endpoints here too


})

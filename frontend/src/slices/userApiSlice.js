import {apiSlice } from './apiSlice'
import { USERS_URL } from '../constants'


//when user will hit this endpoint : {{baseURL}}/users/auth then
//a post query will be performed and the data of request(email,password) will be stored in 'body'

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),

        //when user clicks 'logout' two simultaneous work will be done: 1. by this reducer function, user will be removed from the local storage and 
        //2. inside userApiSlice.js : http://localhost:3000/users/logout this logoutMutation post request will be called and from server 'http only cookie' / jwt will be removed
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),


        //register is similar to to login, after register also it will create 'jwt' http only cookie on server and will set credentials to localhost
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            })
        }),

        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5,
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: 'DELETE',
            })
        }),

        getUsersDetails: builder.query({
            query: (id) => ({
                url:`/admin/user/${id}`,
                //if we write: url: `${USERS_URL}/${id}` this does not create a route like: /api/users/id rather it adds this route to the existing main route: main page route was: http://localhost:3000/admin/userList and now the routes become:
                //http://localhost:3000/admin/userList/api/users/id

                //so need to use this format to create a route: /admin/user/id
                //and also need to handle this route from backend: so need 
                //app.use('/admin/user', userRoutes) this route on backend

                //similar case goes for updateUser and similar case for product edit page , getProductDetails route and updateProduct routes 
            }),
            keepUnusedDataFor: 5,
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `/admin/user/${data.userId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),






    }),
});


//when using apiSlice. method , this naming convention('use' + name of end-point(api) + 'Mutation') used and they are exported directly but when
//createSlice method is used then normal naming is used and they are exported as ().actions

export const {useLoginMutation,
     useLogoutMutation, 
     useRegisterMutation,
     useProfileMutation,
     useGetUsersQuery,
     useDeleteUserMutation,
     useGetUsersDetailsQuery,
     useUpdateUserMutation } = userApiSlice
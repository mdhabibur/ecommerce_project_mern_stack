import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
};
//this sets userInfo in localStorage and get from it
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },

        logout: (state, action) => {
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
        //when user clicks 'logout' two simultaneous work will be done: 1. by this reducer function, user will be removed from the local storage and 
        //2. inside userApiSlice.js : http://localhost:3000/users/logout this logoutMutation post request will be called and from server 'http only cookie' / jwt will be removed

    }
})


export const {setCredentials, logout } = authSlice.actions
export default authSlice.reducer
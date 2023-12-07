import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' }




const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state,action) => {
            const item = action.payload

            //check if the item already exits
            const itemExit = state.cartItems.find((x) => x._id === item._id)

            //if exits then update the quantity else add the new item to cartItems
            if(itemExit){
                state.cartItems = state.cartItems.map((x) => x._id  === itemExit._id ? item: x )
            }else{
                state.cartItems = [...state.cartItems, item]
            }

            return updateCart(state)


        },
        removeFromCart: (state,action) => {
            //filter all the items to return as new state of cartItems except the passed id of pressed delete item
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload)
            //got the new cartItems which does not include the deleted item

            //update the prices and save to storage
            return updateCart(state)
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            // localStorage.getItem('cart', JSON.stringify(state))
            return updateCart(state)
            //save the shipping address to local storage
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            // localStorage.setItem('cart', JSON.stringify(state));
            return updateCart(state)
        },
        clearCartItems: (state, action) => {
            state.cartItems = []
            return updateCart(state)
        }


    }
})
//when using apiSlice. method , this naming convention('use' + name of end-point(api) + 'Mutation') used and they are exported directly but when
//createSlice method is used then normal naming is used and they are exported as ().actions
export const {addToCart,removeFromCart, saveShippingAddress, savePaymentMethod, clearCartItems} = cartSlice.actions
export default cartSlice.reducer
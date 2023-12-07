export const addDecimals = (num) => {
    return (Math.round(num * 100)/100).toFixed(2)
}


export const updateCart = (state) => {

        //calculate itemsPrice
        state.itemsPrice = addDecimals(state.cartItems.reduce((acc,item) => acc + item.price * item.qty,0))

        //calculate shipping Price (if itemsPrice > $100 then add shipping price of $0 else $10)
        state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)
        //calculate tax price ( 15%)
        state.taxPrice = addDecimals(Number((state.itemsPrice * 0.15).toFixed(2)))

        //calculate total price
        state.totalPrice = (
            Number(state.itemsPrice) +
            Number(state.shippingPrice) + 
            Number(state.taxPrice)
        ).toFixed(2)

        //save the whole state to local storage
        localStorage.setItem('cart',JSON.stringify(state))


        return state



}
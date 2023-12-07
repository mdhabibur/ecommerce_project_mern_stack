import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

//why private routes are needed?
//because we will not allow any general user to access routes like 'shipping' routes unless he is an authorized logged in user

const PrivateRoute = () => {

    //first if the user is logged in , get the 'userInfo' object from the 'auth' state 
    //if 'userInfo' exists , he is logged in user, so use <Outlet /> component to load the intended page/screen/component provided by react else
    //redirect the user to '/login' route

  const {userInfo } = useSelector( (state) => state.auth)

  return userInfo ? <Outlet /> : <Navigate to='/login' replace />
  
}

export default PrivateRoute
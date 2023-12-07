import express from 'express'
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js'

import { protect,admin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// router.route('/').post(registerUser).get(getUsers)
//first need to authorize as verified user(means need to login, cookie will be set), then also need to authorize as admin, only then he can perform 'getUsers' request
router.route('/').post(registerUser).get(protect,admin,getUsers)

router.post('/logout', logoutUser)

router.post('/auth', authUser)

// router.route('/profile').get(getUserProfile).put(updateUserProfile)
// to getUserProfile and updateUserProfile , an user need to login (authorize)
router.route('/profile')
        .get(protect,getUserProfile)
        .put(protect,updateUserProfile);

// router.route('/:id').delete(deleteUser).get(getUserById).put(updateUser)
//similarly for deleting, an user must be login and also be the admin
router.route('/:id').delete(protect,admin,deleteUser)
        .get(protect,admin,getUserById)
        .put(protect,admin,updateUser);


export default router
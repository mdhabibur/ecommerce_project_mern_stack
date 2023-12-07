import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import generateToken from "../utils/generateToken.js";

// @desc  auth user and login
// @route POST /api/users/login
// @access public

const authUser = asyncHandler( async (req, res) => {
    console.log(req.body)
    const {email,password} = req.body 
    const user = await User.findOne({email: email})

    if(user && (await user.matchPassword(password))){

      generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(401)
        throw new Error('Invalid email or password')
    }
    
})

// @desc  register new user
// @route POST /api/users
// @access public

const registerUser = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
      res.status(400); //as it is not a server error, client error
      throw new Error("User already exists");
    }

    //else do this
    const user = await User.create({
      name,
      email,
      password
    });


    if(user){
      //is user created, then generate token and send response object
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });

    }else{
      res.status(400);
      throw new Error("invalid user data");
    }


  });

// @desc  logout user and clear cookie
// @route POST /api/users/logout
// @access private

const logoutUser = asyncHandler( async (req, res) => {
    res.cookie('jwt', '', {
      httpOnly:true,
      expires: new Date(0),
    });
    res.status(200).json({message: "logged out successfully"});
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // res.send('get user profile');

    const user = await User.findById(req.user._id);
    //when created cookie, we passed the user to req, so that we can use it every request after login

    if(user){
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }else{
      res.status(404);
      throw new Error("user not found")
    }


  });
  
  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  const updateUserProfile = asyncHandler(async (req, res) => {
    // res.send('update user profile');

    const user = await User.findById(req.user._id);

    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      //if any field is updated, then use the previews value of the database
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not updated');
    }

  });
  
  // @desc    Get all users
  // @route   GET /api/users
  // @access  Private/Admin
  const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
  });
  
  // @desc    Delete user
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  const deleteUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)

    if(user){
      if(user.isAdmin){
        res.status(400)
        throw new Error('Can not delete admin user')
      }

      await User.deleteOne({_id: user._id})
      res.status(200).json({message: 'User removed'})
    }else{
      res.status(404)
      throw new Error('User not found to be deleted')
    }


  });
  
  // @desc    Get user by ID
  // @route   GET /api/users/:id
  // @access  Private/Admin
  const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if(user){
      res.status(200).json(user)
    }else {
      res.status(404)
      throw new Error('User not found')
    }

  });
  
  // @desc    Update user
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)

      const updateUser = await user.save()

      res.status(200).json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin

      })


    } else {

      res.status(404)
      throw new Error('User not found to be Updated')

    }
   


  });

  export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
  };
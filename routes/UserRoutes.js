const { Router } = require('express');
const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController');
const AuthController = require('./../controllers/AuthenticationController');

router.post('/signup', AuthController.signup); //this does not follow
//rest API structure and hence this end point is different 
//this route is different because here we only want to post the data and not get anything from it

router.post('/login', AuthController.login);

router.post('/forgotpassword', AuthController.forgotPassword); //will recieve the email address as a parameter
router.patch('/resetpassword/:token', AuthController.resetPassword); //will recieve the token as well as the new password
router.get('/me', AuthController.protect, UserController.getMe, UserController.getUser); //here we have protected our route first than used that middleware in order to use handler factory getOne function 
router.patch('/updatepassword',AuthController.protect, AuthController.updatePassword);
router.delete('/deleteMe',AuthController.protect, UserController.deleteMe);
router.patch('/updateMe', AuthController.protect, UserController.updateMe);
//the below routes and functions are generally used by admin to update the user get all users data 
//update existing user etc etc
router
    .route('/')
    .get(AuthController.protect,AuthController.restrict('admin'), UserController.getAllusers)

router
    .route('/:id')
    .get(AuthController.protect,AuthController.restrict('admin'),UserController.getUser)
    .patch(AuthController.protect,AuthController.restrict('admin'),UserController.UpdateUser)
    .delete(AuthController.protect,AuthController.restrict('admin'),UserController.DeleteUser)

module.exports = router;
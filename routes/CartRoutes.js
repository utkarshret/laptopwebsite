const express = require('express');
const { route } = require('./ReviewRoutes');
const router = express.Router({mergeParams: true});
const AuthController = require('./../controllers/AuthenticationController');
const CartController = require('./../controllers/CartController');
router
    .route('/')
    .get(AuthController.protect, AuthController.restrict('user','admin'), CartController.getCart)
    .post(AuthController.protect, AuthController.restrict('user','admin'), CartController.addIn);

router
    .route('/:productId')
    .delete(AuthController.protect, AuthController.restrict('user','admin'), CartController.deleteProduct)

module.exports = router;
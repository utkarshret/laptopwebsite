const { Router } = require('express');
const express = require('express');
const router = express.Router();
const ProductController = require('./../controllers/ProductController');
const AuthController = require('./../controllers/AuthenticationController');
const ReviewRouter = require('./../routes/ReviewRoutes'); //importing our review controller to implement nested routes
const CartRouter = require('./../routes/CartRoutes');
//implementing nested routes by merging params

router.use('/:productId/reviews', ReviewRouter); //this means that if url of type /:tourId/reviews is appearing than use reviewRouter
//router is also a middleware function therefore we can use the use method with it 

router.use('/:productId/cart', CartRouter);
router
    .route('/')
    .get(ProductController.getAllProducts)
    .post(AuthController.protect, AuthController.restrict('admin'), ProductController.CreateProduct);

router
    .route('/getTourStats')
    .get(AuthController.protect, AuthController.restrict('admin'),ProductController.getProductStats);
    
router
    .route('/:id')
    .get(ProductController.getProduct)
    .patch(AuthController.protect, AuthController.restrict('admin'),ProductController.UpdateProduct)
    .delete(AuthController.protect, AuthController.restrict('admin'), ProductController.DeleteProduct);


module.exports = router;
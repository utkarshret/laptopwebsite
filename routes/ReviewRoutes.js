const mongoose = require('mongoose');
const express = require('express');
const router = express.Router({ mergeParams: true}); //this is thing that is done to access /:productID/reviews

//by default each router only have access to the parameters of there specific 
//but in creating a review /:tourID/reviews route is used which is not same as the default one for review router defined here
//and the default route is /reviews only and in order to merge the /:tourID parameter we use mergeParams true

const ReviewController = require('./../controllers/ReviewController');
const AuthController = require('./../controllers/AuthenticationController');
//we have routed the /products/:tourId/reviews to this routes.js file but here we dont have the /:tourId 
//so we have to do something here
//here mergeParams will come into play
router
      .route('/')
      .get(ReviewController.getAllReviews)
      .post(AuthController.protect,AuthController.restrict('user'), ReviewController.SetProductandUserid, ReviewController.createReview);

router
      .route('/:id')
      .get(ReviewController.getReview)
      .patch(AuthController.protect, AuthController.restrict('user'), ReviewController.UpdateReview)
      .delete(AuthController.protect, AuthController.restrict('user'), ReviewController.deleteReview);
module.exports = router;

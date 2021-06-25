const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const review = require('./../models/ReviewModel');

exports.getAllReviews = handlerFactory.getAll(review);

//as we have some additional steps in createReview function therefore we have to create a middleware to make it a handlerfactory function
exports.SetProductandUserid = catchAsync(async(req,res,next) => {
    //console.log(req.params);
    //console.log(req.user.id);
    if(!req.body.writtenOn) req.body.writtenOn = req.params.productId; //this if condition means that if there is no mention of writtenOn key value pair in our body than we should consider it from the productId mentioned in URL
    if(!req.body.user) req.body.writtenBy = req.user.id; //this means that if writtenBy is not specified in our body than take the user id from req.user and save it in writtenBy key value pair
    //and req.user is specified inside protect method in our AuthController.js file 

    next();
})
exports.createReview = handlerFactory.CreateOne(review);
exports.getReview = handlerFactory.getOne(review);
exports.deleteReview = handlerFactory.deleteOne(review);

exports.UpdateReview = handlerFactory.UpdateOne(review);
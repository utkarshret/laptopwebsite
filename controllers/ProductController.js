const Product = require('./../models/productModel');
const path = require('path');
const { setFlagsFromString } = require('v8');


const catchAsync = require('./../utils/catchAsync');
const Apperror = require('../utils/Apperror');
const handlerFactory = require('./handlerFactory');
const product = require('./../models/productModel');

exports.getAllProducts = handlerFactory.getAll(Product);

exports.CreateProduct = handlerFactory.CreateOne(Product);

exports.getProduct = handlerFactory.getOne(Product, {path: 'reviews'});
exports.UpdateProduct = handlerFactory.UpdateOne(Product);
exports.DeleteProduct = handlerFactory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req,res,next) => {
        const stats = await Product.aggregate([
            {
                $match: { ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id:null,
                    num: {$sum: 1},
                    numratings: {$sum: '$ratingsAverage'},
                    avgrating: {$avg: '$ratingsAverage'},
                    avgprice: {$avg: '$Price'},
                    minprice: {$min: '$Price'},
                    maxprice: {$max: '$Price'}
                }
            },
            {
                $sort: {avgprice: 1}
            }
        ]);
        res.status(200).json({
            stats
        })
    });

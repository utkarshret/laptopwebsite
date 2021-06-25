const mongoose = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const user = require('./../models/usermodel');
const Product = require('./../models/productModel');

exports.addIn = catchAsync(async(req,res,next) => {
    let product = req.params.productId;
    //console.log(product);
    product = await Product.findById(req.params.productId);
    const freshuser = await user.findById(req.user.id);
    //console.log(freshuser);
    freshuser.cart.push(product);
    freshuser.TotalPrice += product.Price;
    await freshuser.save();
    const cart = freshuser.cart;
    res.status(200).json({
        data: cart,
        TotalPrice: freshuser.TotalPrice
    });
})

exports.getCart = catchAsync((req,res,next) => {
    const cart = req.user.cart;
    res.status(200).json({
        data: cart,
        TotalPrice: req.user.TotalPrice
    })
})

exports.deleteProduct = catchAsync(async(req,res,next) => {
    const freshuser = req.user;
    let cart = freshuser.cart;
    var filteredItems = cart.filter(function(el){
        return el.id != req.params.productId;
    })
    freshuser.cart = filteredItems;
    let price=0;
    filteredItems.map(el => {
        price+=el.Price;
    })
    freshuser.TotalPrice = price;
    await freshuser.save();
    cart = freshuser.cart;
    //console.log(filteredItems);
    req.user = freshuser;
    res.status(200).json({
        cart,
        price
    }) 
})
const path = require('path');
const { use } = require('../routes/ReviewRoutes');
const Apperror = require('../utils/Apperror');
const user = require('./../models/usermodel');
const handlerFactory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    //here obj is req.body
    //and allowedFields is an array which now contains the name and email string
    //and now we need to just loop through each element and check if that element exist in our allowedFields or not
    //if it does exist than update its value as specified in the obj i.e req.body
    //and if not than ignore it
    //at the end return an updated obj so that it can be used by findByIdandUpdate to update certain values
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el))
        {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}
exports.getAllusers = handlerFactory.getAll(user);

exports.getUser = handlerFactory.getOne(user);
exports.UpdateUser = handlerFactory.UpdateOne(user);
exports.DeleteUser = handlerFactory.deleteOne(user);

exports.updateMe = async(req, res, next) => { //this function is triggered by user to update his or her info

    //1. create an error if user tries to update his password (Although we would not provide any field for password)
    if(req.body.password || req.body.passwordConfirm)
    {
        return next(new Apperror('You cannot update your password from here',404));
    }
    //2. update the user document    
    //here we want the validators to work for the field that is specified by the user
    //but here we cannot use the save method because it will trigger all our validators
    //and as we are not dealing with passwords we can use finByIdandUpdate

    //filtered out the fields that are not allowed to be updated
    const x = filterObj(req.body, 'name', 'email'); //here we are filtering out req.body and we need to keep email and name only because they are the only one that needs to be updated
    //and therefore we specify name and email in our filterObj function
    //later we will specify more fields that are need to be updated such as image etc.
    //than we will specify image string too in the filterObj function

    const updatedUser = await user.findByIdAndUpdate(req.user.id, x, {new: true, runValidators: true});
    //here inside updatedUser we have passed three arguments
    //1. is the user id by which we will search the document
    //2. is the data x that we want to update 
    //and instead of using req.body we are using x as if we use req.body the user can update anything
    //user can even update the reset token, its role and can manipulate certain data
    //therefore we are not using req.body here
    //here we only need to update basically the email and password
    //3. an object having new: true so that after finding and updating it returns the updated document
    //runValidators: true will run validators on the field being updated

    res.status(200).json({
        data: {
            updatedUser
        }
    })
}

exports.deleteMe = async(req,res,next) => {
    await user.findByIdAndUpdate(req.user.id, {active: false});
    //here we have set the user's active field to inactive and therefore we need only those users whose active: true in our getallusers query or any other query
    //therefore for this we will make a pre query middleware in usermodel.js file 
        res.status(200).json({
        status: 'success',
        data: null
    })
}

exports.getMe = (req,res,next) => {
    //here we will be using handlerFactory function and it takes the id of the user through parameters that is through url and we want to show the profile of currently logged in user and our currently logged in user data is saved in req.user
    //so we give the value of req.user.id to req.params.id so that handler factory function can use it
    //and we have declared this function as a middleware function for handlerfactory function therefore we will use it before our getOne function
    req.params.id = req.user.id;
    next();
    
}
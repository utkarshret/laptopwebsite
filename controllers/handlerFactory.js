const catchAsync = require('./../utils/catchAsync');
const Apperror = require('./../utils/Apperror');
const APIfeatures = require('./../utils/APIfeatures');

exports.deleteOne = Model => catchAsync(async (req,res,next) => { //here we have defined a function that takes another function as an input and returns a function
    //we have also passed model to define on which model we will use this deletion method

    const doc = await Model.findByIdAndDelete(req.params.id);
    if(doc==null) //!null = true
    {
       return next(new Apperror('No document found with that ID', 404)); //we have used return here so that the tour does not return two responses
        //two responses here will be 
        //1. the error response
       //2. the null value response if we do not use return
   }
   res.send('deleted');
});

//here we have defined a generalized function for deleting anything
//whenever a delete request will be sent than this deleteOne function will take action

exports.UpdateOne = Model =>  catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true
    });
    if(doc==null) //!null = true
    {
       return next(new Apperror('No document found with that ID', 404)); //we have used return here so that the tour does not return two responses
        //two responses here will be 
        //1. the error response
       //2. the null value response if we do not use return
   }
    res.status(200).json({
        data: doc
    })
});

exports.CreateOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.create(req.body);
        //this product variable would be used while rendering json data and webpage
        //code to render the website with newly created product
        res.status(200).json({
            data: doc
        }); 
});

//in getOne function we will have two arguments one is model and another one would be populateOptions
//model will refer to the model whose data we have to get
//populateOptions means if their is a need of populate function 
//like we will need populateOptions while getting a single product because at that time reviews would also be displayed and thus we cannot only display references to our object we need to display data of the reference present their

exports.getOne = (Model, popOptions) => catchAsync(async (req,res,next) => {
    //console.log(req.params);
    let query = Model.findById(req.params.id); //here we are first searching for the query
    if(popOptions)
    {
        //than if the popOptions are present than query than uses populate functions
        query = query.populate(popOptions);
    }
    const doc = await query; //now we await for the final result
    if(doc==null) //!null = true
    {
       return next(new Apperror('No document found with that ID', 404)); //we have used return here so that the tour does not return two responses
        //two responses here will be 
        //1. the error response
       //2. the null value response if we do not use return
   }
        res.status(200).json({
            doc
        })
    });

exports.getAll = Model => catchAsync(async (req,res,next) => {
    //for getting all reviews this if block is necessary and we will pass this filter in our query below
    let filter ={}
    if(req.params.productId) 
    {
        //if we have productId in our parameters than this block will be executed
        //and this block will then will fill the empty filter object
        //here filter object is created with writteOn key value pair
        //and than this filter object is passed into find
        //which will then find the same key value pair in review
        
        filter = {writtenOn: req.params.productId} 
    }
    const features = new APIfeatures(Model.find(filter),req.query)
    .filter()
    .sorting()
    .paginate()
    .limitFields();

//console.log(features);
const doc = await features.query;
res.status(200).json({
    data: doc
});
});
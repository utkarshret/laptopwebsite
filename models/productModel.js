const mongoose = require('mongoose');
const { Db } = require('mongodb');
const path = require('path');
mongoose.connect("mongodb://localhost:27017/Ecommerce",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(con => {
    console.log("connection successful");
});
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    processor: {
        type: String,
        required: true
    },
    ScreenSize: {
        type: String,
        required: true
    },
    Harddisk: {
        type: String,
        required: true
    },
    GraphicCard: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'cannot be less than 1'],
        max: 5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    priceDiscount: {
        type: Number,
        default: 0
    },
    Summary: {
        type: String,
        trim: true,
      //  required : true
    },
    description: {
        type: String,
        trim: true
    },
    ImageCover: {
        type: String,
       // required: true
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
});

const product = mongoose.model('Product',ProductSchema);

//virtual populate
ProductSchema.virtual('reviews', { //virtual populate method
    //first argument is the name of the field that we want to add in our product while displaying it
    //second argument is an object that contains various key value pairs
    //first key value pair is the reference that is from which model we are referencing
    ref: 'review',
    //second key value pair is the foreignField key for which we are referencing and as we are inside product model
    //our foriegn key would be writtenOn because it is referencing our product model and writtenOn means written on which product
    foreignField: 'writtenOn',
    //third key value pair is the local key which means locally we are referencing using which key value pair and that is id because inside the writtenOn field id key value pair is stored only
    localField:'_id',
    select: 'ReviewText'

})
//now we have created our model in separate file therefore we have to export it

module.exports = product;
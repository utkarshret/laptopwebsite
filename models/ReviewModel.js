const mongoose = require('mongoose');
const user = require('./usermodel');
const product = require('./productModel');
mongoose.connect("mongodb://localhost:27017/Ecommerce",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(con => {
    console.log("connection successful");
});

const ReviewSchema = new mongoose.Schema({
    ReviewText : String,
    Rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    writtenOn: { //here we have used parent referencing
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, 'Review must belong to a product']
    },
    writtenBy: { //here we have used parent referencing
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Review should belong to a user']
    }
},{
    toJSON: {virtuals: true},
    toObject: { virtuals: true}
});

//index to check if the product and user combination is unique and than only saving the review
ReviewSchema.index({product: 1, user: 1}, {unique: true});

ReviewSchema.pre(/^find/, function(next){
    console.log("hii");
    this.populate({
        path: 'product',
    }).populate({
        path: 'user'
    });
    next();
});


ReviewSchema.statics.calcAverageRatings = async function(productid){
    //calcAverageRatings is a static method that is used to calculate average ratings
    //this function will have product as an argument because we want the current product to be passed on which this average will be calculted
    //we will use aggregation pipeline here to calculate average
   const stats = await this.aggregate([
        //and here we will pass the array of all the stages
        //first step - select all the reviews of the current document
        {
            $match:{writtenOn: productid} //matching all the products with the given productid
        },
        {
            $group: { //for grouping of documents
                _id: '$writtenOn',
                nRating: { $sum: 1}, //number of ratings
                avgRating: { $avg: '$Rating'}
            }
        }
    ]) //this refers to the current document
    console.log(stats);
   // console.log(productid);
    //here we calculated our average ratings but now we want to update our database key value pairs also
    if(stats.length > 0)
    {
        //this code block means if we have any stats than execute find and update method 
        //else we will update the ratings quantity to 0 and average ratings to 4.5
        await product.findByIdAndUpdate(productid, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    }
    else
    {
        await product.findByIdAndUpdate(productid, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}

//middleware for average rating calculating
ReviewSchema.post('save',async function(next){
    //this points to current review
    //review.calcAverageRatings(this.writtenOn);
    //we cannot call calcAverageRatings like the above declaration because our review variable is declared below
    //and if we declare it before this middleware than our reviewSchema wont contain this middleware neither do our review variable
    //so we will use this.constructor
    //here this refers to the current review and constructor refer to the model who created this document i.e review

    this.constructor.calcAverageRatings(this.writtenOn);
})

ReviewSchema.pre(/^findOneAnd/, async function(next){
    //this middleware will run for all findOne documents having update and delete as well
    //here this keyword is the current query
    //so to get the document we will let the query execute upto findOne only
    //we have used this middleware to basically extract the current document on which update or delete query is being executed
    //we have used this.review here and review is a completely new variable to this
    //we have done this to save our document and because this keyword inside this middleware contains only query because it is a query middleware
    this.review = await this.findOne();
    next();
})

ReviewSchema.post(/^findOneAnd/, async function(){
    //we will use this.review here and we had to use the document found in the above middleware we have stored review inside this keyword
    //this.review is our current document
    console.log(this.review);
    await this.review.constructor.calcAverageRatings(this.review.writtenOn);

})

const review = mongoose.model('review',ReviewSchema);
module.exports =  review;
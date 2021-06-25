exports.getBase= (req,res) =>{
    res.status(200).render('base',{
        product: "HP omen", //this is the object that is being passed with the pug template so that inside pug template we can access this data
        user: "Himanshu" // and this data is called locals

    }); //base is the filename of our pug template i.e base.pug and it is specified inside render so that we can render it

};
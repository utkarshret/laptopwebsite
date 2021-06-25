const express=require('express');
const viewsController= require('../controllers/viewsController');
const router= express.Router();

router.get('/base', viewsController.getBase);




module.exports = router;



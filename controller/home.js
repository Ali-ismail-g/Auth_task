var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var path = require('path');
var HomeRoutes = express.Router();

var correct_path = path.join(__dirname+'/../views/');
HomeRoutes.get('/',(req,res)=>{
    let email = req.session.email;
    res.render('homePage',{user_email: email});
});

module.exports = {"HomeRoutes" : HomeRoutes};
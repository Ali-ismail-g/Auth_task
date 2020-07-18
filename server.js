const express = require("express");
const cors = require("cors");
const bodeParser = require("body-parser");
const app = express();
const session = require('express-session');

const db = require("./database/database");
const fetch = require("node-fetch");
const redis = require("redis");
const moment = require('moment');
const AccountRoutes = require('./controller/auth');
const HomeRoutes = require('./controller/home');

const port = process.env.PORT || 5000;



//------------------redis-----------------
const redis_port = process.env.PORT || 6379;
const client = redis.createClient(redis_port);

app.set('view engine','ejs');
app.use(session({secret: 'randomstringsessionsecret'}));
app.use(bodeParser.json());
app.use(cors());
app.use(bodeParser.urlencoded({extended:false}));

//--------------sync() create table if it is not existed---------------
db.sequelize.sync();

//----------------handle auth controller----------------------
app.use('/',AccountRoutes.AccountRoutes);
// app.use('/',AccountRoutes.getLastLogin);

//----------------handle homepage controller------------------
app.use((req,res,next)=>{
    if(req.session.email == null || req.session.email.length ==0 ){
        res.redirect('/login'); 
    }
    else{
      next();
    }
  });
  app.use('/',HomeRoutes.HomeRoutes);


//------------handle time format---------
app.locals.moment=moment;
app.use ((req, res, next) => {
  res.locals.params = req.params;
  res.locals.host = req.get('host');
  res.locals.protocol = req.protocol;
  next();
  });  

  
app.listen(port,()=>{
    console.log("server is running on port " + port);
})
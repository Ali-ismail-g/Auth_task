const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const db = require("../database/database");
const User = db.users;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
let moment = require('moment');
const accountRoutes = express.Router();
//------redis config--------------
const fetch = require('node-fetch');
const redis = require('redis');
const REDIS_PORT = process.env.PORT || 6379;

const client = redis.createClient(REDIS_PORT);


accountRoutes.get('/login',(req,res)=>{
    res.render('login');
});
accountRoutes.get('/register',(req,res)=>{  
    res.render('register',{errors: ""});
});

accountRoutes.post('/register',(req,res)=>{
    let matched_users_promise = User.findAll({
        where:  Sequelize.or(
            {username:req.body.username},
            {email:req.body.email}
            )
    });
    matched_users_promise.then((users)=>{ 
        console.log("look here",users);
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            User.create({
                first_name:req.body.first_name,
                last_name:req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: passwordHash,
                city:req.body.city,
                DateOfBirth:req.body.DateOfBirth
            }).then(()=>{
                let newSession = req.session;
                newSession.email = req.body.email;
                res.redirect('/login');
            });
        }
        else{
            res.render('/register',{errors: "Username or Email already in user"});
        }
    })
});

accountRoutes.post('/login',(req,res, next)=>{
    var matched_users_promise = User.findAll({
        where: Sequelize.and(
            {email: req.body.email},
        )
    });
    matched_users_promise.then((users)=>{ 
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password,passwordHash)){
                req.session.email = req.body.email;
                console.log("Data",user.dataValues);
                console.log("req.body",req.body);
               
                client.get(req.body.email,(err,data)=>{
                    // if (err) throw err;
                    let email = req.session.email;
                    if (data) {
                        // res.send(data);
                        // let string = encodeURIComponent(data);
                        // res.redirect('/?lastLogin='+ string);
                        console.log("data",data);
                        // console.log(lastLogin);
                        res.render('homePage',{user_email: email,lastLogin:data});
                        //
                      } else {
                        res.render('homePage',{user_email: email,lastLogin:new Date(Date.now())});
                      }
                });
                client.setex(req.body.email, 3600,new Date(Date.now()));
                // console.log("usersData",users);
                // res.redirect('/?lastLogin='+ string);
            }
            else{
                res.redirect('/register');
            }
        }
        else{
            res.redirect('/login');
        }
    });
});

module.exports = {"AccountRoutes" : accountRoutes};
"use strict";

const express = require('express');
const Router = express.Router();
const user = require('./../models/user');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
require('./../config/authentication')(passport);

Router.get('/', (req, res) =>{
    res.render(`${__dirname}/../views/user/major`, {title: 'user routes'});
});

Router.get('/register', (req, res) =>{
    res.render(`${__dirname}/../views/user/register`, {title: 'Form of register users'});
});

Router.post('/register/created', (req, res) =>{
    user.findOne({email_user: req.body.email}).then((email) =>{
        if(email){
            res.redirect('/404');
        }
        else{
            const usernew = new user({
                name_user: req.body.name,
                email_user: req.body.email,
                password_user: req.body.password,
                birth_year: req.body.birth
            });

            bcrypt.genSalt(3, (error, salt) =>{
                bcrypt.hash(usernew.password_user, salt, (err, hash) =>{
                    usernew.password_user = hash;
                    usernew.save().then(() =>{
                        console.log('User registred with success! ');
                        res.redirect('/');
                    }).catch((error) =>{
                        console.error(`Error to register user: ${error} `);
                    });
                });
            });

        }
    });
});

Router.get('/login', (req, res) =>{
    res.render(`${__dirname}/../views/user/loginUser`);
});

Router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = Router;
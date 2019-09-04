"use strict";

const express = require('express');
const Router = express.Router();
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
require('./../config/authentication')(passport);
const {isAdmin} = require('./../Helpers/isAdmin');

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

Router.get('/host/register', (req, res) =>{
    res.render(`${__dirname}/../views/admin/register`, {title: 'Form for create a new host'});
});

Router.post('/host/created', (req, res) =>{
    user.findOne({email_user: req.body.email}).then((emailTrue) =>{
        if(emailTrue){
            console.error('Error: This email is already registred in our system ');
            res.redirect('/user/host/register');
        }

        else{
            user.findOne({CPF_CNPJ_user: req.body.cpf}).then((validate) =>{
                if(validate){
                    console.error('Error: This CPF or CNPJ is already registred in our system ');
                    res.redirect('/user/host/register');
                }

                else{
                    const usernew = new user({
                        name_user: req.body.name,
                        email_user: req.body.email,
                        CPF_CNPJ_user: req.body.cpf,
                        password_user: req.body.password,
                        isAdmin: true,
                        type_user: req.body.type_admin,
                        bio_user: req.body.bio
                    });

                    bcrypt.genSalt(3, (error, salt) =>{
                        bcrypt.hash(usernew.password_user, salt, (error, hash) =>{
                            usernew.password_user = hash;
                            usernew.save().then(() =>{
                                console.log('Admin created with success! ');
                                res.redirect('/user/login');
                            });
                        });
                    });
                }
            });
        }
    });
});

Router.get('/host/login', (req, res) =>{
    res.render(`${__dirname}/../views/admin/login`, {title: 'Login of host'});
});

Router.post('/host/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

Router.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/');
});

Router.get('/add/localization', isAdmin, (req, res) =>{
    res.send('Testing... ');
});

Router.get('/host/hotel', isAdmin,(req, res) =>{
    res.render(`${__dirname}/../views/admin/hosthotel`, {title: 'Add a new hotel in your name'});
});

Router.get('/host/restaurant', isAdmin,(req, res) =>{
    res.render(`${__dirname}/../views/admin/hostrestaurant`, {title: 'Add a new restaurant in your name '});
});

module.exports = Router;

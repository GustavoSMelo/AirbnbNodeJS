"use strict";

const express = require('express');
const Router = express.Router();
const user = require('./../models/user');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

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

Router.post('/login/success', (req, res) =>{
    const getValues = (passport) =>{
        passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done)=>{
            user.findOne({email_user: req.body.email}).then((user) =>{
                if(!user){
                    console.log('Error when I will find this email');
                    res.redirect('/404');
                }
                else{
                    bcrypt.compare(password, req.body.password, (err, equals) =>{
                        if(equals){
                            return done(null, user);
                        }

                        else{
                            console.log('Senha invalida! ');
                            console.log(`${password} e foi : ${user.password_user}`)
                            return done(null, false, {message: "Senha inválida, tente novamente "});
                        }

                        res.redirect('/');
                    });
                }
                
            });

        }));

        passport.serializeUser((user, done) =>{
            done(null, user._id);
        });
    
        passport.deserializeUser((id, done) =>{
            user.findById(id, (err, user) =>{
                done(err, user);
            });
        });

        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req,  res, next);
    }
});

module.exports = Router;
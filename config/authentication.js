"use strict";

const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const user = mongoose.model('user');

module.exports = function(passport){
        passport.use(new localStrategy(
            {usernameField: 'email', passwordField: 'password'}, (email, password, done) =>{
            user.findOne({email_user: email}).then((user) =>{
                if(!user){
                    console.log('Email not find in our system')
                    return done(null, false, console.log('Email not find in our system'));
                }
                else{
                    bcrypt.compare(password, user.password_user, (err, validate) =>{
                        if(validate){
                            console.log('sucess');
                            return done(null, user);
                        }
                        else{
                            console.log('error');
                            return done(null, false);
                        }
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
};
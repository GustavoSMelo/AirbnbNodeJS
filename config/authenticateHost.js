"use strict";

const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const admin = mongoose.model('admin');
const bcrypt = require('bcryptjs');

module.exports = function(passport){    
    passport.use(new localStrategy({usernameField: 'cpf', passwordField: 'password'}, (cpf, password, done) =>{
        admin.findOne({CPF_CNPJ_adm: cpf}).then((admin) =>{
            if(!admin){
                console.error('Email not find in our system ');
                done(null, false);
            }

            else{
                bcrypt.compare(password, admin.password_adm, (err, success) =>{
                    if(success){
                        console.log('success ');
                        done(null, admin);
                    }
                    else{
                        console.error(`${password} | ${admin.password_adm} `);
                        done(null, false);
                    }
                });
            }
        });
    }));

    passport.serializeUser((admin, done) =>{
        done(null, admin._id);
    });

    passport.deserializeUser((id, done) =>{
        admin.findById(id, (error, admin) =>{
            done(error, admin);
        });
    });
}

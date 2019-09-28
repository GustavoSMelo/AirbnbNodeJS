"use strict";

const express = require('express');
const Router = express.Router();
const user = require('./../models/user');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
require('./../config/authentication')(passport);
const {isAdmin} = require('./../Helpers/isAdmin');
const hotel = require('./../models/hotel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, (`${__dirname}/../public/uploads`))
    },

    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }

});
const upload = multer({storage});


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
    user.findOne().then((host) =>{
        res.render(`${__dirname}/../views/admin/hosthotel`, {title: 'Add a new hotel in your name', host: host});
    });
});

Router.get('/host/restaurant', isAdmin,(req, res) =>{
    res.render(`${__dirname}/../views/admin/hostrestaurant`, {title: 'Add a new restaurant in your name '});
});

Router.post('/host/hotel/add', isAdmin, upload.single('image-file') ,(req, res) =>{
    hotel.findOne({name_hotel: req.body.name}).then((name) =>{
        if(name){
            res.redirect(`${__dirname}/../views/admin/hosthotel`);
        }

        else{

            const h = new hotel({
                name_hotel: req.body.name,
                country_hotel: req.body.region,
                longitude_hotel: req.body.longitude,
                latitude_hotel: req.body.latitude,
                stars_hotel: req.body.rating,
                stadia_hotel: req.body.stadia,
                image_hotel: req.file.originalname,
                id_creator: req.body.txtId ,
                description: req.body.description
            }).save().then(() =>{
                console.log('Success to create a new hotel ');
                res.redirect('/user/host/view/hotel');
                console.log(req.file.path);
            }).catch((err) =>{
                console.error(`Error to create a new hotel: ${err} `);
            });
        }
    });

});

Router.get('/host/view/hotel/:id', isAdmin, (req, res) =>{
    hotel.find({id_creator: req.params.id}).then((hotel) =>{
        res.render(`${__dirname}/../views/admin/viewhotel`, {hotel: hotel, title: 'Views hotels'});
    })
});

Router.get('/host/hotel/modify/:id', isAdmin, (req, res) =>{
    hotel.findOne({_id: req.params.id}).then((posts) =>{
        res.render(`${__dirname}/../views/admin/modifyHotel`, {posts: posts, title: 'modify a hotel inserted'});
    })
});

Router.post('/host/hotel/modify/changed', isAdmin,upload.single('image-file'), (req, res) =>{
    hotel.findOne({_id: req.body.id}).then((hotel) =>{
            hotel.name_hotel = req.body.name,
            hotel.country_hotel = req.body.region,
            hotel.longitude_hotel = req.body.longitude,
            hotel.latitude_hotel = req.body.latitude,
            hotel.stars_hotel = req.body.rating,
            hotel.stadia_hotel = req.body.stadia,
            hotel.image_hotel = req.file.originalname,
            hotel.id_creator,
            hotel.description = req.body.description
        hotel.save().then(() =>{
            res.redirect(`/`);
        });
    });
});

Router.post('/host/hotel/delete/:id', (req, res) =>{
    hotel.findOne({_id: req.params.id}).then((hotel) =>{
        hotel.remove().then(() =>{
            res.redirect('/');
        });
    });
});

Router.get('/host/restaurant/new', isAdmin, (req, res) =>{
    res.render(`${__dirname}/../views/admin/hostrestaurant`);
});

module.exports = Router;

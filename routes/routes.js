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
const commentary = require('../models/commentary');
const loved = require('../models/loved');
const restaurant = require('../models/restaurant');

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
                res.redirect('/user/host/view/hotel/:id');
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

Router.post('/host/restaurant/new', isAdmin, upload.single('image-file'), (req, res) =>{
    restaurant.findOne({name_restaurant: req.body.name}).then((rest) =>{
        if(rest){
            res.redirect('/');
        }

        else{
            new restaurant({
                name_restaurant: req.body.name,
                longitude_restaurant: req.body.longitude,
                latitude_restaurant: req.body.latitude,
                rating_restaurant: req.body.rating,
                user_id: req.body.txtId,
                name_image_restaurant: req.file.originalname
            }).save().then(() =>{
                console.log('Sucess to register a new Restaurant! ');
                res.redirect('/');
            });
        }
    });
});

Router.get('/hotel/page/:id', (req, res) =>{
    hotel.findOne({_id: req.params.id}).then((posts) =>{
        loved.findOne({id_hotel: req.params.id}).then((loved) =>{
            commentary.find({id_hotel: req.params.id}).then((comment) =>{
                res.render(`${__dirname}/../views/admin/pagehotel`, {title: 'Visualize hotel', posts: posts, comment: comment, loved: loved});
            });
        });
    });
})

Router.post('/hotel/page/commentary/add', (req, res) =>{
    new commentary({
        commentary: req.body.comment,
        name_creator_commentary: req.body.name_user,
        id_creator_commentary: req.body.id_user,
        id_hotel: req.body.id_hotel
    }).save().then(() =>{
        res.redirect('back');
    });
});

Router.post('/hotel/page/loved/add/:user/:hotel', (req, res) =>{
    loved.findOne({id_user: req.params.user}).then((user) =>{
        if(!user){
            new loved({
                id_user: req.params.user,
                id_hotel: req.params.hotel,
                isLoved: true
            }).save().then(() =>{
                res.redirect('back');
            });
        }

        else{
            loved.findOne({isLoved: req.body.loveded}).then((loved) =>{
                if(req.body.loveded == true || req.body.loveded == "true"){
                    
                        loved.id_user = req.params.user,
                        loved.id_hotel = req.params.hotel,
                        loved.isLoved = false
                    loved.save().then(() =>{
                        res.redirect('back');
                    });
                }
                else if(req.body.loveded == false || req.body.loveded == "false"){
                    
                        loved.id_user = req.params.user,
                        loved.id_hotel = req.params.hotel,
                        loved.isLoved = true
                    loved.save().then(() =>{
                        res.redirect('back');
                    });
                }
            });
        }
    });
});

Router.get('/restaurant/page/:id', (req, res) =>{
    restaurant.findOne({_id: req.params.id}).then((restaurant) =>{
        if(restaurant) {
            commentary.find({id_hotel: req.params.id}).then((comment) =>{
                loved.findOne({id_hotel: req.params.id}).then((loved) =>{
                    res.render(`${__dirname}/../views/admin/pagerestaurant`, {title: 'view hotel', restaurant: restaurant, comment: comment, loved: loved});
                });
            });
        }
        else{
            res.redirect('/404');
        }
    });
});

Router.post('/restaurant/page/loved/add/:user/:restaurant/:tf', (req, res) =>{
    loved.findOne({id_user: req.params.user}).then((user) =>{
        if(!user){
            new loved({
                id_user: req.params.user,
                id_hotel: req.params.restaurant,
                isLoved: true
            }).save().then(() =>{
                res.redirect('back');
            });
        }

        else{
            loved.findOne({isLoved: req.params.tf}).then((loved) =>{
                if(req.body.loveded == true || req.body.loveded == "true"){
                    
                        loved.id_user = req.params.user,
                        loved.id_hotel = req.params.restaurant,
                        loved.isLoved = false
                    loved.save().then(() =>{
                        res.redirect('back');
                    });
                }
                else if(req.body.loveded == false || req.body.loveded == "false"){
                    
                        loved.id_user = req.params.user,
                        loved.id_hotel = req.params.restaurant,
                        loved.isLoved = true
                    loved.save().then(() =>{
                        res.redirect('back');
                    });
                }
            });
        }
    });
});

Router.post('/restaurant/page/commentary/add', (req, res) =>{
    new commentary({
        commentary: req.body.comment,
        name_creator_commentary: req.body.name_user,
        id_creator_commentary: req.body.id_user,
        id_hotel: req.body.id_restaurant
    }).save().then(() =>{
        res.redirect('back');
    });
});

Router.get('/host/view/restaurant/:id',isAdmin, (req, res) =>{
    restaurant.find({user_id: req.params.id}).then((restaurant) =>{
        res.render(`${__dirname}/../views/admin/viewrestaurant`, {title: 'View restaurants', restaurant: restaurant});
    }).catch(() =>{
        res.redirect('/404');
    });
});

Router.post('/host/restaurant/delete/:id', isAdmin, (req, res) =>{
    restaurant.findOne({_id: req.params.id}).then((restaurant) =>{
        if(restaurant){
            commentary.find({id_hotel: req.params.id}).then(() =>{
                loved.find({id_hotel: req.params.id}).then(() =>{
                    restaurant.remove({_id: req.params.id}).then(() =>{
                        commentary.deleteMany({id_hotel: req.params.id}).then(() =>{
                            loved.deleteMany({id_hotel: req.params.id}).then(() =>{
                                res.redirect('back');
                            });
                        });
                    });
                });
            });
        }

        else{
            res.redirect('/404');
        }
    });
});

module.exports = Router;

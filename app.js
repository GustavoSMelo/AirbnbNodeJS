"use strict";

//Loading modules
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars');
    const path = require('path');
    const body_parser = require('body-parser'); 
    const user = require('./routes/userRoutes');
    const session = require('express-session');
    const passport = require('passport');
    require('./config/authentication')(passport);
    const flash = require('connect-flash');
    const admin = require('./routes/adminRoutes');
//configurations

    //sessions
        app.use(session({
            secret: 'da1bizunesasenha',
            resave: true,
            saveUninitialized: true
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.use((req, res, next) =>{
            res.locals.user = req.user || null;
            next(); 
        });

    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    
    //bodyparser
        app.use(body_parser.json());
        app.use(body_parser.urlencoded({extended: true}));

    //routes
        app.use('/user', user);
        app.use('/admin', admin);

//routes

    app.get('/', (req, res) =>{
        res.render(`${__dirname}/views/index`, {title: 'Home page Airbnb'});
    });

    
    app.get('/404', (req, res) =>{
        res.send('Error 404 not find');
    })

//other

    app.use(express.static(path.join(__dirname,'public')));

    const PORT = 9997;
    app.listen(PORT, () =>{
        console.log('Server running in port: http://localhost:9997/');
    });

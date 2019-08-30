"use strict";

//Loading modules
    const express = require('express');
    const app = express();
    const handlebars = require('express-handlebars');
    const path = require('path');
    const body_parser = require('body-parser'); 
    const user = require('./routes/userRoutes');
//configurations

    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    
    //bodyparser
        app.use(body_parser.json());
        app.use(body_parser.urlencoded({extended: true}));

    //routes
        app.use('/user', user);

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

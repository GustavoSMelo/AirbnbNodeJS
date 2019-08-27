"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true}).then(() =>{
    console.log('Access granted for database! ');
}).catch((err) =>{
    console.error(`Access denied, because we have a problem: ${err}`);
});

const usuario = mongoose.Schema({
    name_user:{
        type: String,
        require: true
    },

    email_user: {
        type: String,
        require: true
    },

    password_user: {
        type: String,
        require: true
    },

    birth_year: {
        type: Date,
        require: true
    }
});

mongoose.model('user', usuario);
const user = mongoose.model('user');

module.exports = user;

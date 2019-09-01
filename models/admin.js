"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true}).then(() =>{
    console.log('Access granted for database admin');
}).catch((err) =>{
    console.error(`Fail for access a database: ${err}`);
});

const adm = mongoose.Schema({
    name_adm: {
        type: String,
        require: true
    },

    email_adm:{
        type: String,
        require: true
    },

    password_adm: {
        type: String,
        require: true
    },

    CPF_CNPJ_adm:{
        type: String,
        require: true
    },

    isAdmin: {
        type: Boolean,
        require: true,
        default: true
    },

    type_adm:{
        type: String,
        require: true
    },

    date_reg:{
        type: Date,
        require: true,
        default: Date.now()
    },

    bio_adm:{
        type: String,
        require: true
    }
});

mongoose.model('admin', adm);
const admin = mongoose.model('admin');

module.exports = admin;

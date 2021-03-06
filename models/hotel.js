"use strict";

const mongoose = require('mongoose');
//const template = handlebars.compile(source);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true});

const hotel = mongoose.Schema({
    name_hotel: {
        type: String,
        require: true
    },

    country_hotel:{
        type: String,
        require: true
    },

    longitude_hotel:{
        type: Number,
        require: true
    },

    latitude_hotel:{
        type: Number,
        require: true
    },

    stars_hotel: {
        type: Number,
        require: true
    },

    stadia_hotel: {
        type: Number,
        require: true
    },

    image_hotel: {
        type: String,
        require: true
    },

    createAt: {
        type: Date,
        require: true, 
        default: Date.now()
    },
    description: {
        type: String,
        require: true
    },

    id_creator:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
});

mongoose.model('hotel', hotel);
const h = mongoose.model('hotel');

module.exports = h;

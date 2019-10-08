"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true});

const restaurant = mongoose.Schema({
    name_restaurant: {
        type: String,
        require: true
    },

    longitude_restaurant: {
        type: String,
        require: true
    },

    latitude_restaurant: {
        type: String,
        require: true
    },

    rating_restaurant:{
        type: Number,
        require: true
    },

    name_image_restaurant: {
        type: String,
        require: true
    },

    user_id:{
        type: String, 
        require: true
    }
});

mongoose.model('restaurant', restaurant);
const r = mongoose.model('restaurant');

module.exports = r;

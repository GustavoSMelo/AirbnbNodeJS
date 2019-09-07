"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true});

const restaurant = mongoose.Schema({
    name_restaurant: {
        type: String,
        require: true
    },

    localization_restaurant: {
        type: String,
        require: true
    },

    rating_restaurant:{
        type: Number,
        require: true
    }
});

mongoose.model('restaurant', restaurant);
const r = mongoose.model('restaurant');

module.exports = r;

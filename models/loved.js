"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb',{useNewUrlParser: true});

const love = mongoose.Schema({
    id_hotel: {
        type: mongoose.Schema.Types.ObjectId
    },

    id_user:{
        type: mongoose.Schema.Types.ObjectId
    }, 

    createAt: {
        type: Date,
        default: Date.now()
    },

    isLoved: {
        type: Boolean,
        default: false
    },

    name_hotel: String,

    image_hotel: String,

    isHotel: Boolean
});

mongoose.model('loved', love);
const loved = mongoose.model('loved');

module.exports = loved;

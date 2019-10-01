"use strict";

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/airbnb', {useNewUrlParser: true});

const comentario = mongoose.Schema({
    commentary: {
        type: String,
    },

    name_creator_commentary:{
        type: String
    },
    id_creator_commentary:{
        type: mongoose.Schema.Types.ObjectId
    },

    id_hotel:{
        type: mongoose.Schema.Types.ObjectId
    },

    createAt:{
        type: Date,
        require: true,
        default: Date.now()
    }
});

mongoose.model('commentary', comentario);
const commentary = mongoose.model('commentary');

module.exports = commentary;

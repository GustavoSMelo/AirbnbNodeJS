"use strict";

const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const user = require('./../models/user');

module.exports = function(passport){
    passport.use
};
"use strict";

const express = require('express');
const Router = express.Router();

Router.get('/', (req, res) =>{
    res.render(`${__dirname}/../views/user/major`, {title: 'user routes'});
});

module.exports = Router;
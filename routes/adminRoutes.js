"use strict";

const express = require('express');
const Router = express.Router();
const admin = require('./../models/admin');
const bcrypt = require('bcrypt');

Router.get('/host', (req, res) =>{
    res.render(`${__dirname}/../views/admin/register`, {title: 'Form of register a host'});
});

Router.post('/host/created', (req, res) =>{
    admin.findOne({CPF_CNPJ_adm: req.body.cpf}).then((registred) =>{
        if(registred){
            res.redirect('/host/created', {title: 'Form of register a host'});
        }

        else{
            const admnew = new admin({
                name_adm: req.body.name,
                email_adm: req.body.email,
                password_adm: req.body.password,
                CPF_CNPJ_adm: req.body.cpf,
                type_adm: req.body.type_adm,
                bio_adm: req.body.bio
            });

            bcrypt.genSalt(3, (err, salt)=>{
                bcrypt.hash(admnew.password_adm, salt, (erro, hash) =>{
                    admnew.password_adm = hash;
                    admnew.save().then(() =>{
                        console.log('Admin registred');
                    }).catch((err) =>{
                        console.error(`Erro to save admin: ${err}`);
                    });
                })
            });
        }
    });

    res.redirect('/admin/login');
});

Router.get('/login', (req, res) =>{
    res.render(`${__dirname}/../views/admin/login`);
});

module.exports = Router;

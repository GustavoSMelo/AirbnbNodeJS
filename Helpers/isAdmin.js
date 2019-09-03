"use strict";

module.exports = {
    isAdmin: (req, res, next) =>{
        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next();
        }

        else{
            res.redirect('/');
        }
    }
}
'use strict';

let passport = require('../config/passport');

module.exports = function(req, res, next) {
    passport.authenticate('jwt', function( error, user, loginError) {
        if (loginError) {
            let errors = [ { location: "header", param: "token", msg: loginError.message} ];
            return res.status(403).json( { success: false, message: 'Forbidden', errors:  errors, data: null} );  
        }
        if(error) { 
            let errors = [ { location: "server", param: "server", msg: "Internal Server Error"} ];
            return res.status(500).json({success: false, message: 'Server Error', error: errors, data: null});  //return res.serverError(error);
        }
        if (!user){
            let errors = [ { location: "header", param: "token", msg: "Not authenticated User"} ];
            return res.status(401).json({success: false, message: 'Forbidden', error: errors, data: null});
        }
        req.user = user;

        next();
    })(req, res);
};
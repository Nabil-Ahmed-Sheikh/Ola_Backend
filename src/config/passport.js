const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var RefreshTokenStrategy = require('passport-refresh-token').Strategy;
let jwt = require('jsonwebtoken');
let User = require('../models/User');
const AuthService = require("../services/authService");


const JWT_STRATEGY_CONFIG = {
    expiresInMinutes: process.env.JWT_EXPIRE_IN_MINUTE || 60 * 60 * 24 * 30 * 3,
    expiresInMinutesRefresh: process.env.JWT_EXPIRE_IN_MINUTE_REFRESH || 60 * 60 * 24 * 30 * 3,
    secretOrKey: process.env.JWT_SECRET || 'mysecret',
    issuer: process.env.JWT_ISSUER || 'mysite.com',
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    audience: process.env.JWT_AUDIENCE || 'mysite.com',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
    
};

passport.use("local", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, 
function (email, password, cb) {
    
    email = email.trim().toLowerCase()
    
  
    User.findOne({email: email})
    .then(user => {
        if (!user || !AuthService.comparePassword(password, user)) {
            return cb(null, false, {message: 'Incorrect email or password.'});
        }
        return cb(null, user, {message: 'Logged In Successfully'});
    })
    .catch(err => cb(err));


    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    
}
));

passport.use(new JwtStrategy({
    jwtFromRequest: JWT_STRATEGY_CONFIG.jwtFromRequest,
    secretOrKey   : JWT_STRATEGY_CONFIG.secretOrKey
    },
    function (jwtPayload, cb) {
        
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findById(jwtPayload.user._id, '-password', { lean: true })
            .then(auth => {
                return cb(null, auth );
            })
            .catch(err => {
                return cb(err);
            });
        }
));

passport.use(new RefreshTokenStrategy(
    function(token, done) {
        jwt.verify(token, JWT_STRATEGY_CONFIG.secretOrKey, function(err, decoded) {
            //console.log(decoded.foo) // bar
            if(err){
                return done(err);
            }
          User.findOne({ id: decoded.id }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user, { scope: 'all' });
          });
          });
    }
  ));




//module.exports.jwt = JWT_STRATEGY_CONFIG;
module.exports = passport;
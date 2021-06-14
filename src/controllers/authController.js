let User = require("../models/User");
const AuthService = require("../services/authService")
let passport = require("../config/passport");
require('dotenv').config()

module.exports = {

    register: async function (req, res) {
        
        let {
          name,
          email,
          password,
          gender,
        } = req.body;
        
        const userFound = await User.findOne({ email: email });

    
        if (userFound) {
        res.status(400).json({
            success: false,
            fail: true,
            message: "Email already registered"
        });
        }  else {
            let user = new User();
            user.name = name;
            user.email = email;
            user.gender = gender;
 
    
            let hash = AuthService.md5Hashed(password)
            user.password = hash;
            try {
              await user.save()
            } catch (error) {
              return res.status(StatusService.INTERNAL_SERVER_ERROR).json({
                success: true,
                message: "User registration unsuccessful"
              })
            }
    
            res.status(200).json({
                success: true,
                message: "User registered"
            })
    
        }
        
    },

    login: async function (req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ success: false, login: "failed", message: "Incorrect combination", });
            }

            req.login(user, { session: false }, async (err) => {
            if (err) {
                res.status(StatusService.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Login failed",
                error: err
                })
            }

            user = null;
            
            user = await User.findOne({ email: email });
            
            
            if(user){
                if(user.status == 'ACTIVE'){
                    user = user.toJSON();
                    let tokenUser = {
                        _id:user._id,
                        name:user.name,
                        email:email,
                        type:user.usertype
                    };

                    const token = AuthService.createToken(tokenUser);
                    const refresh_token = AuthService.createRefreshToken(tokenUser);

                    return res.status(200).json({
                        success: true,
                        message: "Logged in successful",
                        errors: null,
                        data: { token: token, refresh_token: refresh_token, user: user },
                    });
                }
                
                return res.status(400).json({
                success: false,
                message: "Login failed",
                });
                

                
            }
            else{
                return res.status(500).json({
                success: false,
                message: "Login failed",
                });

            }
            
            });
        })(req, res, next);
        
    },

    loginAdmin: async function (req, res, next) {
        let badgeNumber = req.body.badgeNumber;
        let password = req.body.password;
        console.log(req.body);
        
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ success: false, login: "failed", message: "Incorrect combination", });
            }

            req.login(user, { session: false }, async (err) => {
            if (err) {
                res.status(StatusService.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Login failed",
                error: err
                })
            }

            user = null;
            
            user = await User.findOne({ badgeNumber: badgeNumber });
            
            
            if(user){
                if(user.userStatus === 'ACTIVE' && user.userType === "ADMIN"){
                user = user.toJSON();
                let tokenUser = {
                    _id:user._id,
                    name:user.name,
                    badgeNumber:user.badgeNumber,
                    userType:user.userType
                };

                const token = AuthService.createToken(tokenUser);
                const refresh_token = AuthService.createRefreshToken(tokenUser);

                return res.status(200).json({
                    success: true,
                    message: "Logged in successful",
                    errors: null,
                    data: { token: token, refresh_token: refresh_token, user: user },
                });
                }
                
                return res.status(400).json({
                success: false,
                message: "Login failed",
                });
                

                
            }
            else{
                return res.status(500).json({
                success: false,
                message: "Login failed",
                });

            }
            
            });
        })(req, res, next);
        
    },
};
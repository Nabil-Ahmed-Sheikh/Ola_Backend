const jwt = require('jsonwebtoken')
const User = require("../models/User")

module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userType = decoded.user.userType;
        if(userType !== "ADMIN"){
            return res.status(401).json({
                success: false,
                message: "Not authorized for the action"
            })
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized for the action"
        })
    }

    

}
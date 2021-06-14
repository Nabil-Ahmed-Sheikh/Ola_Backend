const jwt = require('jsonwebtoken')

/*
 Extracts the user info from jwt token
 Works with post requests only
*/
module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body.requester = decoded.user
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something went wrong while getting user information"
        })
    }

    

}
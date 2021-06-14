let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');

module.exports = {
    hashPassword: function(user) {
        if (user.password) {
        user.password = bcrypt.hashSync(user.password, 12);
        }
    },

    comparePassword: function(password, user) {
        let md5Hash = this.md5Hashed(password)
        var result = false;
        if(md5Hash == user.password){   
            result = true
        }
        // let result = bcrypt.compareSync(password, user.password);
        return result;
    },

    createToken: function(user) {
        //console.log(user);
        return jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 3) , id: user._id, user: user }, 'mysecret');
    },

    createRefreshToken: function(user){
        //console.log(user);
        return jwt.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3, id: user._id, user:user }, 'mysecret');
    },
    makeHashed: function(password) {
        return bcrypt.hashSync(password, 12);
    },
    md5Hashed: function(stringForEncrypt){
        return crypto.createHash('md5').update(stringForEncrypt).digest("hex");
    }
};
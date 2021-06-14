let User = require("../models/User");
var sanitize = require('mongo-sanitize');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


module.exports = {

    getAllUser: async function (req, res) {      
    
        let allUSers = await User.find({userStatus: "ACTIVE"})

        res.status(200).json({
            success: true,
            message: "User List Fetched",
            userList: allUSers
        })
    
    },

    getUsers: async function (req, res) {
        let page =  sanitize(req.query.page);
        let perpage = Number(sanitize(req.query.perpage));
        let skip = page * perpage;
        if(!(page && perpage)){
            res.status(400).json({
                success: false,
                message: "Bad Request"
            })
        }

        let userList = await User.find({userStatus: "ACTIVE"}).skip(skip).limit(perpage)
        let count = await User.find({userStatus: "ACTIVE"}).count()

        if(!userList || !count){
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            })
        }
        if(userList.length === 0){
            return res.status(403).json({
                success: false,
                message: "No user found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Users retrieved",
            userList,
            count
        })

    },

    getUser: async function (req, res) {
        let userId = sanitize(req.query.userId);

        if(!userId){
            return res.status(400).json({
                success: false,
                message: "User Id required"
            });
        }

        let user = await User.findOne({_id: ObjectId(userId)});

        if(!user){
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched",
            user
        })

    }
        
      
};
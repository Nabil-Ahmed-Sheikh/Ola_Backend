const express = require('express');
const router = express.Router();
const { getUser, getUsers, getAllUser } = require('../controllers/userController');
const isAuthenticated = require("../middlewares/isAuthenticate");
const isAdmin = require("../middlewares/isAdmin");
const addRequester = require('../middlewares/addRequester');

// users
router.get('/getAllUsers', isAuthenticated, addRequester, getAllUser);
router.get('/getUsers', getUsers);
router.get('/getUser', getUser)


module.exports = router;
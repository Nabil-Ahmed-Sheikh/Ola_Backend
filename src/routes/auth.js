const express = require('express');
const router = express.Router();
const {login, register} = require('./../controllers/authController');
const isAuthenticated = require("../middlewares/isAuthenticate");
const isAdmin = require("../middlewares/isAdmin");
const addRequester = require('../middlewares/addRequester');

router.post('/login', login);
router.post('/register', register);
// router.post('/register', isAuthenticated, isAdmin, addRequester, register);

module.exports = router;
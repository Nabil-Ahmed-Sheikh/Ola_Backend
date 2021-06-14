const express = require('express');
const router = express.Router();
const {register, loginAdmin} = require('./../controllers/authController');
const isAuthenticated = require("../middlewares/isAuthenticate");
const isAdmin = require("../middlewares/isAdmin");
const addRequester = require('../middlewares/addRequester');

router.post('/login', loginAdmin);
router.post('/register', isAuthenticated, isAdmin, register);

module.exports = router;
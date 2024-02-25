const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/posts');
});

// DEBUG USE: Check if user is authenticated
router.get('/check', function(req, res, next) {    
  jwt.verify(req.cookies.JWT_TOKEN, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
      if (err) return res.status(401).json({msg: 'USER AUTHENTICATION FAILED'});
      return res.status(200).json({msg: 'USER AUTHENTICATED'});
  }))
},)

router.post('/login', userController.login);

module.exports = router;

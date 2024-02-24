const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')

// Attaches token from request header to the request itself
function attachToken(req, res, next){
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof(bearerHeader) !== 'undefined'){
      // Split at the space
      const bearer = bearerHeader.split(' '); // Turning into array
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next Middleware
      next();
  }else{
      // Forbidden
      return res.status(400).send({msg: 'JWT Token missing'});
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/posts');
});

// DEBUG USE: Check if user is authenticated
router.get('/check', attachToken, function(req, res, next) {    
  jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
      if (err) return res.status(401).json({msg: 'USER AUTHENTICATION FAILED'});
      return res.status(200).json({msg: 'USER AUTHENTICATED'});
  }))
},)

router.post('/login', userController.login);

module.exports = router;

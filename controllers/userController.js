const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const jwt = require('jsonwebtoken')

// Log in page
// Create and send back token
exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({name: req.body.name}).exec(); // TODO: AUTHENTICATE USER by password (bcryptjs)
    if (user){
        jwt.sign({user}, process.env.SECRET_CODE, (err, token) => {
            res.json({
                token
            });
        });
    }else{
        res.sendStatus(406);
    }
});


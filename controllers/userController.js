const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Called by middleware functions
function validateForm(_,_,next){
    const errors = validationResult(req); // Extract the validation errors from a request.
    if (!errors.isEmpty())  return res.status(400).json(errors.mapped());
    next();
}

exports.login = [
    body("name", "Title must not be empty").isLength({ min: 1}).escape(),
    body("password", "Password must not be empty").isLength({ min: 1}).escape(),
    validateForm,
    
    // Form data is valid. Check that user exists in DB and that password matches
    asyncHandler(async (req, res, next) => {
        const user = await User.findOne({name: req.body.name}).exec();
        if (user){
            // Verify Password
            const passwordMatch = await bcrypt.compare(req.body.password, user.password)
            if (passwordMatch){
                jwt.sign({user}, process.env.SECRET_CODE, (err, token) => res.json({token}))
            }else{
                return res.sendStatus(401)
            }  
        }else{
            return res.status(400).send({msg: 'User not in DB'}); // User does not exist in the db
        }
    }),
]
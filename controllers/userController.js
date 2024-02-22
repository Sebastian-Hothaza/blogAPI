const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.login = [
    body("name", "Title must not be empty").isLength({ min: 1}).escape(),
    body("password", "Password must not be empty").isLength({ min: 1}).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req); // Extract the validation errors from a request.
        if (!errors.isEmpty())  return res.status(400).json(errors.mapped());
            
        // Form data is valid. Check that uses exists in DB and that password matches
        const user = await User.findOne({name: req.body.name}).exec();
        if (user){
            if (await bcrypt.compare(req.body.password, user.password)){
                jwt.sign({user}, process.env.SECRET_CODE, (err, token) => res.json({token})); // Create and send back token
            }else{
                res.sendStatus(401);
            }
            
        }else{
            res.status(400).send({msg: 'User not in DB'}); // User does not exist in the db
        }
    }),
]




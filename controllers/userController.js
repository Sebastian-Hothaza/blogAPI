const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Home page - all posts
exports.login = (req, res, next) => {
    res.send(`TODO: Implement login POST request: ${req.body.password}`);
};


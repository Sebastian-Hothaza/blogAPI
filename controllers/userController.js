const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Log in page
// Create and send back token
exports.login = (req, res, next) => {
    res.send(`TODO: Implement login POST request: ${req.body.password}`);
};


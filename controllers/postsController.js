const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')

// Home page - retrieves all posts
exports.index_get = asyncHandler(async (req, res, next) => {
    const posts = await BlogPost.find().exec();   
    res.json(posts);
});

exports.index_post = [
    // Validate and sanitize the name field.
    body("name", "Name must contain at 3-20 characters").trim().isLength({ min: 3, max: 20}).escape(),
    //TODO: Check other fields, plus check that the body contains the fields we need to build up our post object

    
    asyncHandler(async (req, res, next) => {
        // Verify the token
        jwt.verify(req.token, 'secret', (err, authData) => {
            if (err){
                res.send(`FAILED! Token is: ${req.token}`);
            }else{
                res.send('Ok, you can post!')
            }
        })
    }),
]


    


// All comments for a specific post
exports.comments_get = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({parentPost: req.params.postID}).exec(); 
    res.json(comments);
});

// Specific post
exports.post_get = asyncHandler(async(req, res, next) => {
    const post = await BlogPost.findById(req.params.postID);
    res.json(post)
})
exports.post_put = (req, res, next) => {
    res.send(`TODO: Implement PUT for specific post: ${req.params.postID}`);
}
exports.post_delete = (req, res, next) => {
    res.send(`TODO: Implement DELETE for specific post: ${req.params.postID}`);
}


// Specific comment
exports.comment_get = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentID);
    res.json(comment);
});
exports.comment_post = [
    // Validate and sanitize the name field.
    body("name", "Name must contain at 3-20 characters").trim().isLength({ min: 3, max: 20}).escape(),
    //TODO: Check other fields, plus check that the body contains the fields we need to build up our comment object

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const comment = new Comment({
            name: req.body.name,
            comment: req.body.comment,
            parentPost: req.params.postID,
            timestamp: new Date()
        })

        if (!errors.isEmpty()){
            // There are errors
            res.sendStatus(400);
        }else{
            // Request is valid, create entry in DB
            await comment.save();
            res.sendStatus(201);
        }

    })
]
exports.comment_put = (req, res, next) => {
    res.send(`TODO: Implement PUT for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}
exports.comment_delete = (req, res, next) => {
    res.send(`TODO: Implement DELETE for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}



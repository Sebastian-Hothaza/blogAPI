const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')

// Called by middleware functions
function validateForm(req,res,next){
    const errors = validationResult(req); // Extract the validation errors from a request.
    if (!errors.isEmpty())  return res.status(400).json(errors.mapped());
    next();
}

// Home page - retrieves all posts
exports.index_get = asyncHandler(async (req, res, next) => {
    const posts = await BlogPost.find().exec();   
    return res.json(posts);
});

exports.index_post = [
    body("title", "Title must contain at 6-20 characters").trim().isLength({ min: 6, max: 20}).escape(),
    body("content", "Content must contain at 10-200 characters").trim().isLength({ min: 6, max: 200}).escape(),
    validateForm,

    // Verify the token and process the request
    (req, res, next) => {
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});;
            // User is authenticated; we can create the post
            const post = new BlogPost({
                author: authData.user._id,
                title: req.body.title,
                content: req.body.content,
                timestamp: new Date(),
            })
            await post.save();
            return res.sendStatus(201);
        }))
    },
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



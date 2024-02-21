const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Home page - retrieves all posts
exports.index_get = asyncHandler(async (req, res, next) => {
    const posts = await BlogPost.find().exec();   
    res.json(posts);
});

// All comments for a specific post
exports.comments_get = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({parentPost: req.params.postID}).exec(); 
    res.json(comments);
});

// Specific post
exports.post_get = (req, res, next) => {
    res.send(`TODO: Implement GET for specific post: ${req.params.postID}`);
}
exports.post_post = (req, res, next) => {
    res.send(`TODO: Implement POST for specific post: ${req.params.postID}`);
}
exports.post_put = (req, res, next) => {
    res.send(`TODO: Implement PUT for specific post: ${req.params.postID}`);
}
exports.post_delete = (req, res, next) => {
    res.send(`TODO: Implement DELETE for specific post: ${req.params.postID}`);
}


// Specific comment
exports.comment_get = (req, res, next) => {
    res.send(`TODO: Implement GET for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}
exports.comment_post = (req, res, next) => {
    res.send(`TODO: Implement POST for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}
exports.comment_put = (req, res, next) => {
    res.send(`TODO: Implement PUT for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}
exports.comment_delete = (req, res, next) => {
    res.send(`TODO: Implement DELETE for specific comment: ${req.params.commentID} on post ${req.params.postID}`);
}
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;


// Called by middleware functions
// Validates the form contents and builds errors array. In case of errors, returns 400 with errors array
function validateForm(req,res,next){
    const errors = validationResult(req); // Extract the validation errors from a request.
    if (!errors.isEmpty())  return res.status(400).json(errors.mapped());
    next();
}

// Called by middleware functions
// Verify that the req.params.postID is a valid objectID and that it exists in our DB
async function validatePostId(req, res, next){
    if (!ObjectId.isValid(req.params.postID)) return res.status(404).send({msg: 'postID is not a valid ObjectID'});
    const postExists = await BlogPost.exists({_id: req.params.postID});
    if (!postExists) return res.status(404).send({msg: 'Post does not exist'});
    next();
}

// Called by middleware functions
// Verify that the req.params.commentID is a valid objectID and that it exists in our DB
async function validateCommentId(req, res, next){
    if (!ObjectId.isValid(req.params.commentID)) return res.status(404).send({msg: 'commentID is not a valid ObjectID'});
    const commentExists = await Comment.exists({_id: req.params.commentID});
    if (!commentExists) return res.status(404).send({msg: 'Comment does not exist'});
    next();
}


// All posts
exports.index_get = asyncHandler(async (req, res, next) => {
    const posts = await BlogPost.find().exec();   
    return res.json(posts);
});

// All comments for a specific post
exports.comments_get = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({parentPost: req.params.postID}).exec(); 
    return res.json(comments);
});

// Specific post
exports.post_get = asyncHandler(async(req, res, next) => {
    if (ObjectId.isValid(req.params.postID)){
        const post = await BlogPost.findById(req.params.postID);
        return res.json(post)
    }else{
        return res.status(404).send({msg: 'postID is not a valid ObjectID'});
    } 
})
exports.index_post = [
    body("title", "Title must contain at 6-20 characters").trim().isLength({ min: 6, max: 20}).escape(),
    body("content", "Content must contain at 10-200 characters").trim().isLength({ min: 6, max: 200}).escape(),
    validateForm,

    // Verify the token and process the request
    (req, res, next) => {
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});
            // User is authenticated; we can create the post
            const post = new BlogPost({
                author: authData.id,
                title: req.body.title,
                content: req.body.content,
                timestamp: new Date(),
            })
            await post.save();
            return res.status(201).json({_id: post.id});
        }))
    },
]
exports.post_put = [
    body("title", "Title must contain at 6-20 characters").trim().isLength({ min: 6, max: 20}).escape(),
    body("content", "Content must contain at 10-200 characters").trim().isLength({ min: 6, max: 200}).escape(),
    validateForm,
    validatePostId,

    // Verify the token and process the request
    (req, res, next) => {
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});;
            // User is authenticated; we can edit the post
            const post = new BlogPost({
                author: authData.id,
                title: req.body.title,
                content: req.body.content,
                timestamp: new Date(),
                _id: req.params.postID
            })
            await BlogPost.findByIdAndUpdate(req.params.postID, post, {});
            return res.status(201).json({_id: post.id});
        }))
    },
]
exports.post_delete = [
    validatePostId,
    (req,res,next)=>{
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});;
            // User is authenticated; we can delete the post
    
            await BlogPost.findByIdAndDelete(req.params.postID);
            return res.sendStatus(200);
        }))
    }
]
    


// Specific comment
exports.comment_get = asyncHandler(async (req, res, next) => {
    if (ObjectId.isValid(req.params.commentID)){
        const comment = await Comment.findById(req.params.commentID);
        return res.json(comment)
    }else{
        return res.status(404).send({msg: 'postID is not a valid ObjectID'});
    } 
});
exports.comment_post = [
    body("name", "Name must contain at 3-20 characters").trim().isLength({ min: 3, max: 20}).escape(),
    body("comment", "Comment must contain at 3-200 characters").trim().isLength({ min: 3, max: 200}).escape(),
    validateForm,
    validatePostId,  //Check that postID is a valid objectID AND that the object actually exists as it is used in parentPost property in the comment object we build below

    // Process request 
    asyncHandler(async (req, res, next) => {
        const comment = new Comment({
            name: req.body.name,
            comment: req.body.comment,
            parentPost: req.params.postID,
            timestamp: new Date()
        })
        await comment.save();
        return res.status(201).json({_id: comment.id});
    })
]
exports.comment_put = [
    body("name", "Name must contain at 3-20 characters").trim().isLength({ min: 3, max: 20}).escape(),
    body("comment", "Comment must contain at 3-200 characters").trim().isLength({ min: 3, max: 200}).escape(),
    validateForm,
    validatePostId, //Check that postID is a valid objectID AND that the object actually exists as it is used in parentPost property in the comment object we build below
    validateCommentId, //Check that commentID is a valid objectID AND that the object actually exists so we can update it 

    // Verify the token and process the request
    (req, res, next) => {
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});;
            // User is authenticated; we can edit the comment
            const comment = new Comment({
                name: req.body.name,
                comment: req.body.comment,
                parentPost: req.params.postID,
                timestamp: new Date(),
                _id: req.params.commentID
            })
            await Comment.findByIdAndUpdate(req.params.commentID, comment, {});
            return res.status(201).json({_id: comment.id});
        }))
    },
]
exports.comment_delete = [
    validatePostId, //Check that postID is a valid objectID AND that the object actually exists 
    validateCommentId, //Check that commentID is a valid objectID AND that the object actually exists
    (req,res,next)=>{
        jwt.verify(req.token, process.env.SECRET_CODE, asyncHandler(async (err, authData) => {
            if (err) return res.status(401).send({msg: 'JWT Validation Fail'});;
            // User is authenticated; we can delete the comment
            await Comment.findByIdAndDelete(req.params.commentID);
            return res.sendStatus(200);
        }))
    },
]
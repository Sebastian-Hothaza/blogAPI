const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController')

// All posts
router.get('/', postsController.index_get);

// All comments for a specific post
router.get('/:postID/comments', postsController.comments_get);

// Specific post
router.get('/:postID', postsController.post_get);
router.post('/', attachToken, postsController.index_post);
router.put('/:postID', attachToken, postsController.post_put);
router.delete('/:postID', attachToken, postsController.post_delete);

// Specific comment
router.get('/:postID/comments/:commentID', postsController.comment_get);
router.post('/:postID/comments/', postsController.comment_post);
router.put('/:postID/comments/:commentID', attachToken, postsController.comment_put);
router.delete('/:postID/comments/:commentID', attachToken, postsController.comment_delete);

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



module.exports = router;
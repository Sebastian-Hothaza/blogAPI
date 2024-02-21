const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController')

// Home page - all posts 
router.get('/', postsController.index_get);
router.post('/', postsController.index_post);

// All comments for a specific post
router.get('/:postID/comments', postsController.comments_get);

// Specific post
router.get('/:postID', postsController.post_get);
router.put('/:postID', postsController.post_put);
router.delete('/:postID', postsController.post_delete);

// Specific comment
router.get('/:postID/comments/:commentID', postsController.comment_get);
router.post('/:postID/comments/', postsController.comment_post);
router.put('/:postID/comments/:commentID', postsController.comment_put);
router.delete('/:postID/comments/:commentID', postsController.comment_delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/posts');
});

router.post('/login', userController.login);

module.exports = router;

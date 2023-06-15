var express = require('express');
var router = express.Router();

const { loginPost } = require('../../src/controllers/loginController');
const { register } = require('../../src/controllers/registerController');
const { authenticateToken } = require('../../src/utils/authHelper');

// Login route
router.post('/login', loginPost);

// Register route
router.post('/register', register);

/* GET users listing. */
router.get('/users', function (req, res, next) {
    res.send('respond with a resource');
});

// Protected route (requires authentication)
router.get('/testing', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});

// router.get('/api/v1/login', function(req, res, next) {
//   res.send('Testing');
// });


module.exports = router;

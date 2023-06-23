var express = require('express');
var router = express.Router();

const { loginPost } = require('../../src/controllers/loginController');
const { register } = require('../../src/controllers/registerController');
const { userDashboard } = require('../../src/controllers/dashboardController');
const { userMessages,getMessageStatus,createMessage } = require('../../src/controllers/messageController');

const { authenticateToken } = require('../../src/utils/authHelper');

// Login route
router.post('/login', loginPost);


// Register route
router.post('/register', register);

// Dashboard route
router.get('/dashboard', authenticateToken, userDashboard);

// Messages list route
router.get('/messages', authenticateToken, userMessages);
// Message status route
router.get('/message/:id/status', authenticateToken, getMessageStatus);
// Create Message route
router.post('/message', authenticateToken, createMessage);

/* GET users listing. */
router.get('/users', function (req, res, next) {
    res.send('respond with a resource');
});

// Protected route (requires authentication)
router.get('/testing', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});




module.exports = router;

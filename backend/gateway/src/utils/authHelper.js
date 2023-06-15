// src/utils/authHelper.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const return_data = {status:false,message: '',result:{}};
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return_data.message = 'Missing token';
    return res.status(401).json(return_data);
  }

  jwt.verify(token, process.env.Token_Secret_Key, (err, user) => {
    if (err) {
      return_data.message = 'Invalid token';
      return res.status(403).json(return_data);
    }
    req.user = user;
    next();
  });
}


module.exports = {
  authenticateToken,
};

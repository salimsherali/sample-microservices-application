// src/controllers/loginController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { responseReturn } = require('../utils/Helper');


async function loginPost(req, res) {

    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return responseReturn(res, 401, false, 'Username and password are required', {});
    }

    try {
        // console.log("username",username);
        // Find the user with the given username and password
        const user = await User.findOne({
            where: {
                email: username,
            },
        });

        // If user not found, return error
        if (!user) {
            return responseReturn(res, 401, false, 'Invalid email or password', {});
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If passwords don't match, return error
        if (!isPasswordValid) {
            return responseReturn(res, 401, false, 'Invalid email or password', {});
        }

        // Create and sign a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.Token_Secret_Key, {
            expiresIn: process.env.Token_Expiry,
        });
        var result = {};

        // Return the token    
        result.token = token;
        result.user = { id: user.id, name: user.name, email: user.email };

        return responseReturn(res, 200, true, 'Login successful', result);

    } catch (error) {
        console.error('Error during login:', error);
        return responseReturn(res, 500, false, 'Internal server error', {});
    }
}

module.exports = {
    loginPost,
};

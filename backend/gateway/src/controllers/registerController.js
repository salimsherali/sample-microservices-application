// controllers/registerController.js

const { User } = require('../../models');
const { responseReturn } = require('../utils/Helper');

async function register(req, res) {
    const { email, password, name} = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return responseReturn(res, 401, false, 'Email and password are required', {});
    }


    try {
        // Check if the user already exists
        const existingUser = await User.findOne({
            where: {
                email,
            },
        });

        // If user already exists, return error
        if (existingUser) {
            return responseReturn(res, 409, false, 'User already exists', {});
        }

        // Create a new user
        const newUser = await User.create({
            email,
            name,
            password,
        });

        // Return success response
        return responseReturn(res, 200, true, 'User registered successfully', {});

    } catch (error) {
        console.error('Error during registration:', error);
        return responseReturn(res, 500, false, 'Internal server error', {});

    }
}

module.exports = {
    register,
};

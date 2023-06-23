// src/controllers/dashboardController.js

const { User, Message } = require('../../models');
const { responseReturn } = require('../utils/Helper');


async function userDashboard(req, res) {

    try {
      

        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });


        // If user not found, return error
        if (!user) {
            return responseReturn(res, 401, false, 'Invalid user!', {});
        }
        var result = {};
        const { count } = await Message.findAndCountAll({
            where: {
                from_user_id: user.id
            }
        });
        result.message = count;
        return responseReturn(res, 200, true, 'successful', result);

    } catch (error) {
        console.error('Error during login:', error);
        return responseReturn(res, 500, false, 'Internal server error', {});
    }
}

module.exports = {
    userDashboard,
};

// src/controllers/messageController.js
const { Op } = require('sequelize');
const { User, Message } = require('../../models');
const { responseReturn } = require('../utils/Helper');
const amqpcallback = require('amqplib/callback_api');

async function userMessages(req, res) {
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

    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of messages per page

    const offset = (page - 1) * limit;

    // Search term (optional)
    const search = req.query.search || '';

    // Sorting options
    const sortField = req.query.sortField || 'createdAt'; // Default sort field
    const sortOrder = req.query.sortOrder || 'DESC'; // Default sort order

    const { count, rows } = await Message.findAndCountAll({
      where: {
        from_user_id: user.id,
        [Op.or]: {
          message: {
            [Op.like]: `%${search}%`,
          },
          to_number: {
            [Op.like]: `%${search}%`,
          },
          status: {
            [Op.like]: `%${search}%`,
          },
        },
      },
      order: [[sortField, sortOrder]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit); // Calculate total pages

    const records = rows;

    return responseReturn(res, 200, true, 'Successful', { records, totalPages });
  } catch (error) {
    console.error('Error:', error);
    return responseReturn(res, 500, false, 'Internal server error', {});
  }
}

async function getMessageStatus(req, res) {
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

    const messageId = req.params.id;
    const message = await Message.findOne({
      where: {
        id: messageId,
        from_user_id: req.user.id,
      },
    });

    // If message not found or doesn't belong to the user, return error
    if (!message) {
      return responseReturn(res, 404, false, 'Message not found!', {});
    }

    const status = message.status;

    return responseReturn(res, 200, true, 'Message status retrieved successfully', { status });
  } catch (error) {
    console.error('Error:', error);
    return responseReturn(res, 500, false, 'Internal server error', {});
  }
}

async function createMessage(req, res) {
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

    const { toNumber, message } = req.body;

    // Perform form validation
    if (!toNumber || !message) {
      return responseReturn(res, 400, false, 'To Number and Message are required.', {});
    }

    if (message.length > 200) {
      return responseReturn(res, 400, false, 'Message cannot exceed 200 characters.', {});
    }

    // Create the message
    const newMessage = await Message.create({
      from_user_id: user.id,
      to_number: toNumber,
      message: message,
      status: 'Pending',
      create_by: user.id,
    });

    // add in qunue    

    try {
      let msgQunue = JSON.stringify({ id: newMessage.id, to_number: newMessage.to_number, message: newMessage.message, date: new Date() });

      const amqpServer = `amqp://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_HOST}`;
      amqpcallback.connect(amqpServer, function (err, connection) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        connection.createConfirmChannel(function (err, channel) {
          if (err) {
            console.error(err);
          }
          channel.assertExchange(process.env.AMQP_QUEUE_EXCHANGE, 'direct', { durable: true }, function (err) {
            if (err) {
              console.error(err);

            }

            channel.publish(process.env.AMQP_QUEUE_EXCHANGE, process.env.AMQP_QUEUE_KEY, Buffer.from(msgQunue), { persistent: true }, function (err) {
              if (err) {
                console.error(err);
              }
           

              channel.waitForConfirms(function (err) {
                if (err) {
                  console.error(err);

                }

                console.log(`Message ${newMessage.id} Qunue confirmed`);

                channel.close(function () {
                  connection.close();
                });
              });
            });
          });
        });


      });


    } catch (error) {

      console.log(error);
    }

    return responseReturn(res, 201, true, 'Message created successfully', { message: newMessage });
  } catch (error) {
    console.error('Error:', error);
    return responseReturn(res, 500, false, 'Internal server error', {});
  }
}

module.exports = {
  userMessages,
  getMessageStatus,
  createMessage
};

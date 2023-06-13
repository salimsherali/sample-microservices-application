const amqplib = require("amqplib");
const config = require("./config");

const AMQP_USERNAME = config.general.amqp.username;
const AMQP_PASSWORD = config.general.amqp.password;
const workerPath = config.general.base_path_worker + config.message_listener.path_worker;
const queue = config.message_listener.queue_name;

// Wrap the code inside an async function for easier error handling
(async () => {
  // Log a message indicating the start of the listeners if enabled in the configuration
  if (config.general.console_message) {
    console.log("listeners: Start");
  }

  // Define the function to call the worker and pass the necessary arguments
  const call_worker = async (msg, channel = null, queue_msg = null) => {
    let message = require(`${workerPath}`);
    await message(msg, channel, queue_msg);
  };

  if (config.general.console_message) {
    // Log the queue name being used
    console.log("listeners - queue", queue);
  }


  // Connect to the AMQP server
  const conn = await amqplib.connect(
    `amqp://${AMQP_USERNAME}:${AMQP_PASSWORD}@localhost:5672`
  );

  // Create a channel within the connection
  const channel = await conn.createChannel();

  // Assert the existence of the queue
  await channel.assertQueue(queue);

  // Consume messages from the queue
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      if (!msg.fields.redelivered) {
        // Log the parsed JSON content if enabled in the configuration
        if (config.general.console_message) {
          console.log("JSON.parse", JSON.parse(msg.content.toString()));
        }

        // Parse the message content and call the worker function
        var mes_obj = JSON.parse(msg.content.toString());
        await call_worker(mes_obj.data, channel, msg);
      } else {
        // Log a warning for redelivered messages if enabled in the configuration
        if (config.general.console_message) {
          console.log("Received:", msg);
        }

        // TODO: Send redelivered messages to the reprocess queue
      }
    } else {
      // Log a message when the consumer is cancelled by the server
      if (config.general.console_message) {
        console.log("Consumer cancelled by server");
      }
    }
  }, { noAck: false }); // Enable message acknowledgments
})();

const amqplib = require("amqplib");
const config = require("./config");
const axios = require('axios');

const AMQP_USERNAME = config.general.amqp.username;
const AMQP_PASSWORD = config.general.amqp.password;
const AMQP_HOST = config.general.amqp.host;
const AMQP_QUEUE = config.message_listener.queue_name;
const MW_HOST = config.message_listener.worker.host;
const MW_BA_USERNAME = config.message_listener.worker.basic_auth.username;
const MW_BA_PASSWORD  = config.message_listener.worker.basic_auth.password;
const CONSOLE_MESSAGE  = config.general.console_message;


// Wrap the code inside an async function for easier error handling
(async () => {
  // Log a message indicating the start of the listeners if enabled in the configuration
  if (CONSOLE_MESSAGE) {
    console.log("listeners: Start");
  }

  // Define the function to call the worker and pass the necessary arguments
  const call_worker = async (msg, channel = null, queue_msg = null) => {

    if (CONSOLE_MESSAGE) {
      // Worker Process
      // console.log("Worker Process", msg);
      console.log("Worker Process");
    }

    let data = queue_msg.content.toString();

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: MW_HOST,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${MW_BA_USERNAME}:${MW_BA_PASSWORD}`).toString('base64')}`
      },
      data: JSON.stringify(msg)
    };

    try {
      axios.request(config)
      .then((response) => {
       
        if(response.data.status){

          console.log("Processed and ack the message");
          channel.ack(queue_msg);

        }else{
          console.log('Error Message:',response.data.message);
        }

      })
      .catch((error) => {
        console.log('Error:',error);
      });
     
    } catch (error) {
      console.error('Error - Main:', error);
    }
  
    
  };

  if (CONSOLE_MESSAGE) {
    // Log the queue name being used
    console.log("listeners - queue", AMQP_QUEUE);
  }


  // Connect to the AMQP server
  const conn = await amqplib.connect(
    `amqp://${AMQP_USERNAME}:${AMQP_PASSWORD}@${AMQP_HOST}`
  );

  // Create a channel within the connection
  const channel = await conn.createChannel();

  // Assert the existence of the queue
  await channel.assertQueue(AMQP_QUEUE);

  // Consume messages from the queue
  channel.consume(AMQP_QUEUE, async (msg) => {
    if (msg !== null) {
      // if (!msg.fields.redelivered) {
      // Log the parsed JSON content if enabled in the configuration
      if (CONSOLE_MESSAGE) {
        console.log("JSON.parse", JSON.parse(msg.content.toString()));
      }

      // Parse the message content and call the worker function
      var mes_obj = JSON.parse(msg.content.toString());
      await call_worker(mes_obj, channel, msg);
      // } else {
      //   // Log a warning for redelivered messages if enabled in the configuration
      //   if (CONSOLE_MESSAGE) {
      //     console.log("Received:", msg);
      //   }

      //   // TODO: Send redelivered messages to the reprocess queue
      // }
    } else {
      // Log a message when the consumer is cancelled by the server
      if (CONSOLE_MESSAGE) {
        console.log("Consumer cancelled by server");
      }
    }
  }, { noAck: false }); // Enable message acknowledgments
})();

module.exports = {
    message_listener: {
        worker:{
            host: 'http://localhost:7000/message-worker',
            basic_auth:{
                username:'admin',
                password:'password'
            }
        },
        queue_name: "SMA_Message_Q"
    },
    general: {
        database: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            port: '3306',
            database: 'sample_am_gateway'
        },
        amqp: {
            host:'localhost:5672',
            username: 'guest',
            password: 'guest',
        },
        base_path_worker: "../ms-worker/",
        console_message:true

    }
}
module.exports = {
    message_listener: {
        path_worker: "MessageWorker/",
        queue_name: "SMA_Message_Q"
    },
    general: {
        database: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            port: '3306',
            database: 'sam'
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
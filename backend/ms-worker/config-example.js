module.exports = {
    message_worker: {
        basic_auth:{
            username:'admin',
            password:'password'
        }
    },
    general: {
        database: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            port: '3306',
            database: 'sample_am_gateway'
        },
        base_path_worker: "../ms-worker/",
        console_message:true,
        port:7000

    }
}
const express = require('express');
const basicAuth = require('express-basic-auth');
const mysql = require('mysql');
const app = express();
const config = require('./config');

const BASIC_AUTH_USERNAME = config.message_worker.basic_auth.username;
const BASIC_AUTH_PASSWORD = config.message_worker.basic_auth.password;
const PORT = config.general.port;



app.use(express.json());

app.get('*', function (req, res) {
    console.log('get/* Not found');
    res.status(404).send('Sample Microservices Application - Worker');
});

app.use(
    basicAuth({
        users: { [BASIC_AUTH_USERNAME]: BASIC_AUTH_PASSWORD }
    })
);

app.post('/message-worker', function (req, res) {
    const data = req.body;
    console.log(data);

    // MySQL configuration
    const dbConfig = {
        host: config.general.database.host,
        user: config.general.database.user,
        password: config.general.database.password,
        database: config.general.database.database
    };

    const connection = mysql.createConnection(dbConfig);
    connection.connect();

    // Update the record in MySQL
    const sql = 'UPDATE messages SET status = ? WHERE id = ?';
    const values = ["delivered", data.id];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error updating record:', error);
            res.status(500).json({ status: false, message: 'Error updating record', result: {} });
        } else {
            console.log('Record updated successfully');
            res.status(200).json({ status: true, message: 'Record updated successfully', result: {} });
        }

        connection.end();
    });
});

app.post('*', function (req, res) {
    console.log('post/* not found');
    res.status(404).send('Not found');
});

app.listen(PORT, () => {
    console.log('Worker is running on port', PORT);
});

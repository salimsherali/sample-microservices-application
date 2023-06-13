# Sample Microservices Application
Scalable microservices-based application that processes and distributes messages using RabbitMQ, with a frontend interface for managing and displaying the messages.

## Installation / Setup
Step 1: Clone the repository

Step 2.0: Setup Gateway
```bash
    cd backend\gateway

    cp .env-example .env
    
    npm install

    npx sequelize-cli db:migrate
```

Step 2.1: You need DB connection information to your .env file

DB_HOST

DB_PORT

DB_DATABASE

DB_USERNAME

DB_PASSWORD

Step 3.0: Installation & Configure RabbitMQ

Step 3.1: Add exchange name SMA_Message_X

Step 3.2: Add queue name SMA_Message_Q

Step 3.3: Bind queue(SMA_Message_Q) with exchange(SMA_Message_X), and use routing key SMA_Message_K 

Step 4.0: Setup Listener
```bash
    cd backend\ms-listener

    cp config-example.js config.js

    npm install
```

Step 4.1: You need DB connection information to your .env file

DB_HOST

DB_PORT

DB_DATABASE

DB_USERNAME

DB_PASSWORD

Step 4.2: Start Listener
```bash
    node MessageListener.js
```

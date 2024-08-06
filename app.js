const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const port = process.env.PORT;

const http = require("http").createServer(app);
const path = require('path')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

const allowedOrigins = [
    "localhost:3001",
    "localhost:3000",
    "http://192.168.1.181:3001",
    "http://192.168.1.181:3000",
  ];
  
  const corsOptions = {
    origin: allowedOrigins,
    credentials: true  // Allow credentials (cookies, authorization headers)
  };
  
app.use(cors(corsOptions));


// Example modules handling routes under /api/secure/chat
let modulesLoaded = false;

try {
    const endpoints = require('./endpoints.js');  endpoints(app);
    modulesLoaded = true;
} catch (error) {
    console.error("Error loading modules:", error);
}

if (modulesLoaded) {
    try {
        app.use((req, res, next) => {
            const Error = require('./404/error.js')
            new Error(req, res);
        });
    } catch (error) {
        console.error("Error loading routes:", error);
        res.status(500).send('Something went wrong!');
    }
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

http.listen(port, () => {
    console.log(`AccessGate is listening on port ${port}`);
});

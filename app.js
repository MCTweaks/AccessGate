const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
// eslint-disable-next-line no-undef
const port = process.env.PORT;

const http = require("http").createServer(app);
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

const Utility = require('./Utilites/utility.js')
// Example modules handling routes under /api/secure/chat
let modulesLoaded = false;

try {
    const endpoints = require('./endpoints.js');  endpoints(app);

    app.get('/application/assets/servefile', (req, res) => {
        new Utility(req, res).serveFile();
    })

    modulesLoaded = true;
} catch (error) {
    console.error("Error loading modules:", error);
}

if (modulesLoaded) {
    try {
        app.use((req, res) => {
            new Utility(req, res).error();
        });
    } catch (error) {
        console.error("Error loading routes:", error);
    }
}

// Global error handler
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

http.listen(port, () => {
    console.log(`AccessGate is listening on port ${port}`);
});

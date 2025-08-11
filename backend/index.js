const express = require('express');
const app = express();
const http = require('http'); // Create HTTP server for socket.io
const server = http.createServer(app); //  Replace app.listen with server.listen
const { Server } = require('socket.io'); //Import Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    }
});

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// 🔌 Global access to io
app.set('io', io); // You can now access this inside any route like: req.app.get('io')

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ping Test
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// Routes
app.use('/auth', require('./Routes/AuthRouter'));
app.use('/products', require('./Routes/ProductRouter'));
app.use('/messdeduction', require('./Routes/messDeductionRoutes'));
app.use('/hostel-allotment', require('./Routes/HostelAllotment'));
app.use('/notices', require('./Routes/noticeRoutes'));

//  Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(' New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log(' Client disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});

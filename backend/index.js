// ==============================
//  Server Entry Point (index.js)
// ==============================

const express = require('express');
const http = require('http'); // For socket.io
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Connect to Database
require('./Models/db');

// Create app and server
const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS security
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*', // Allow only frontend domain in production
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Global access to io (so routes can emit events)
app.set('io', io);

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Health check
app.get('/ping', (req, res) => {
    res.status(200).send('PONG');
});

// Routes
app.use('/auth', require('./Routes/AuthRouter'));
app.use('/products', require('./Routes/ProductRouter'));
app.use('/messdeduction', require('./Routes/messDeductionRoutes'));
app.use('/hostel-allotment', require('./Routes/HostelAllotment'));
app.use('/notices', require('./Routes/noticeRoutes'));
app.use('/analytic', require('./Routes/Analytics'));

// Socket.IO events
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Example: Listen to custom event
    socket.on('message', (data) => {
        console.log('📩 Message from client:', data);
        // Emit back to all clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Server start
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

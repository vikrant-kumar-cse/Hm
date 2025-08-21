// ==============================
//  Server Entry Point (index.js)
// ==============================

const express = require('express');
const http = require('http'); // For socket.io
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env variables
dotenv.config();

// Connect to Database
require('./Models/db');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

// Make io available globally in routes
app.set('io', io);

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====================
// ROUTES
// ====================

// Health check
app.get('/ping', (req, res) => {
    res.status(200).send('PONG');
});

app.use('/auth', require('./Routes/AuthRouter'));
app.use('/products', require('./Routes/ProductRouter'));
app.use('/messdeduction', require('./Routes/messDeductionRoutes'));
app.use('/hostel-allotment', require('./Routes/HostelAllotment'));
app.use('/notices', require('./Routes/noticeRoutes'));
app.use('/analytic', require('./Routes/Analytics'));
app.use('/messrecord',require('./Routes/ApprovedRecord'));

// ✅ NEW: Grievance Route
app.use('/grievance', require('./Routes/grievanceRoutes'));

// ====================
// SOCKET.IO EVENTS
// ====================
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('message', (data) => {
        console.log('📩 Message from client:', data);
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// ====================
// START SERVER
// ====================
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

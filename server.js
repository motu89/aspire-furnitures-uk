const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const Order = require('./models/Order');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspirefurniture';

// Configure MongoDB connection based on environment
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
};

// Add SSL options for production environments (MongoDB Atlas)
if (process.env.NODE_ENV === 'production' && MONGODB_URI.includes('mongodb.net')) {
    mongooseOptions.tls = true;
    mongooseOptions.tlsInsecure = false; // Set to true only if having SSL certificate issues
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send existing orders to newly connected admin clients
    socket.on('admin-connected', async () => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            socket.emit('initial-orders', orders);
        } catch (error) {
            console.error('Error sending initial orders:', error);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Delete all orders endpoint
app.delete('/api/delete-all-orders', async (req, res) => {
    try {
        // Delete all orders from database
        await Order.deleteMany({});
        
        // Emit event to all connected admin clients
        io.emit('all-orders-deleted');

        res.json({ 
            success: true, 
            message: "All orders deleted successfully" 
        });
    } catch (error) {
        console.error('Error deleting all orders:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error deleting all orders. Please try again." 
        });
    }
});

// Delete order endpoint
app.delete('/api/delete-order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        // Delete order from database
        const result = await Order.deleteOne({ id: orderId });
        
        // Check if any order was actually deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        // Emit the deleted order ID to all connected admin clients
        io.emit('order-deleted', orderId);

        res.json({ 
            success: true, 
            message: "Order deleted successfully" 
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error deleting order. Please try again." 
        });
    }
});

// Submit order endpoint
app.post('/api/submit-order', async (req, res) => {
    try {
        const orderData = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        // Save order to database first
        const order = new Order(orderData);
        await order.save();
        
        // Emit the new order to all connected admin clients
        io.emit('new-order', orderData);

        res.json({ 
            success: true, 
            message: "✅ Your order is booked! For order tracking or updates, WhatsApp us."
        });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error submitting order. Please try again." 
        });
    }
});

// Get all orders endpoint
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching orders. Please try again." 
        });
    }
});

// Admin route to view orders
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.send(
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<title>Admin - Orders</title>' +
            '<style>' +
            'body {' +
            '    font-family: Arial, sans-serif;' +
            '    padding: 20px;' +
            '    background: #faf7f2;' +
            '}' +
            '.order {' +
            '    background: white;' +
            '    padding: 20px;' +
            '    margin-bottom: 20px;' +
            '    border-radius: 8px;' +
            '    box-shadow: 0 2px 5px rgba(0,0,0,0.1);' +
            '}' +
            '.order h3 {' +
            '    color: #5d4037;' +
            '    margin-top: 0;' +
            '}' +
            '.order-details {' +
            '    color: #8b5e3c;' +
            '}' +
            '.timestamp {' +
            '    color: #999;' +
            '    font-size: 0.9em;' +
            '}' +
            '</style>' +
            '</head>' +
            '<body>' +
            '<h1>Orders</h1>' +
            orders.map(order => 
                '<div class="order">' +
                '<h3>Order ID: ' + order.id + '</h3>' +
                '<div class="timestamp">Ordered on: ' + new Date(order.timestamp).toLocaleString() + '</div>' +
                '<div class="order-details">' +
                '<p><strong>Product:</strong> ' + (order.productName || order.product || 'N/A') + '</p>' +
                '<p><strong>Size:</strong> ' + (order.selectedSize || order.size || 'N/A') + '</p>' +
                '<p><strong>Color:</strong> ' + (order.color || 'N/A') + '</p>' +
                '<p><strong>Quantity:</strong> ' + (order.quantity || '1') + '</p>' +
                '<p><strong>Price:</strong> ' + (order.price || order.totalPrice || 'N/A') + '</p>' +
                '<p><strong>Customer:</strong> ' + (order.name || order.customer || 'N/A') + '</p>' +
                '<p><strong>Address:</strong> ' + (order.address || 'N/A') + '</p>' +
                '<p><strong>Postcode:</strong> ' + (order.postcode || 'N/A') + '</p>' +
                '<p><strong>WhatsApp:</strong> ' + (order.whatsapp || 'N/A') + '</p>' +
                '<p><strong>Selected Image:</strong> ' + (order.selectedImage || 'N/A') + '</p>' +
                '<p><strong>Payment Method:</strong> ' + (order.paymentMethod || 'N/A') + '</p>' +
                '<p><strong>Status:</strong> ' + (order.status || 'pending') + '</p>' +
                '</div>' +
                '</div>'
            ).join('') +
            '</body>' +
            '</html>'
        );
    } catch (error) {
        res.status(500).send('Error loading orders');
    }
});

// Initialize and start server
async function startServer() {
    const PORT = process.env.PORT || 3002;
    
    // Start the server first
    http.listen(PORT, () => {
        console.log('Server running on port ' + PORT);
    });
    
    console.log('Attempting to connect to MongoDB...');
    
    try {
        // Attempt MongoDB connection after starting the server
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Server running without database connection');
        // Don't exit the process - continue running the server
    }
}

// Start the server
startServer();

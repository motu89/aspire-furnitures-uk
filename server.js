const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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

// Store orders in a JSON file
const ORDERS_FILE = 'orders.json';

// Initialize orders file if it doesn't exist
async function initOrdersFile() {
    try {
        await fs.access(ORDERS_FILE);
    } catch {
        await fs.writeFile(ORDERS_FILE, '[]');
    }
}

// Read orders from file
async function readOrders() {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
}

// Write orders to file
async function writeOrders(orders) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send existing orders to newly connected admin clients
    socket.on('admin-connected', async () => {
        try {
            const orders = await readOrders();
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
        // Save empty array to orders file
        await writeOrders([]);
        
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
        let orders = await readOrders();
        
        // Filter out the order to be deleted
        const initialLength = orders.length;
        orders = orders.filter(order => order.id !== orderId);
        
        // Check if any order was actually deleted
        if (orders.length === initialLength) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        // Save updated orders
        await writeOrders(orders);
        
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
        const order = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        const orders = await readOrders();
        orders.push(order);
        await writeOrders(orders);
        
        // Emit the new order to all connected admin clients
        io.emit('new-order', order);

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

// Admin route to view orders
app.get('/admin/orders', async (req, res) => {
    try {
        const orders = await readOrders();
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
            orders.reverse().map(order => 
                '<div class="order">' +
                '<h3>Order ID: ' + order.id + '</h3>' +
                '<div class="timestamp">Ordered on: ' + new Date(order.timestamp).toLocaleString() + '</div>' +
                '<div class="order-details">' +
                '<p><strong>Product:</strong> ' + order.productName + '</p>' +
                '<p><strong>Size:</strong> ' + (order.selectedSize || order.size || 'N/A') + '</p>' +
                '<p><strong>Color:</strong> ' + (order.color || 'N/A') + '</p>' +
                '<p><strong>Quantity:</strong> ' + (order.quantity || '1') + '</p>' +
                '<p><strong>Price:</strong> ' + order.price + '</p>' +
                '<p><strong>Customer:</strong> ' + (order.name || order.customer) + '</p>' +
                '<p><strong>Address:</strong> ' + order.address + '</p>' +
                '<p><strong>Postcode:</strong> ' + order.postcode + '</p>' +
                '<p><strong>WhatsApp:</strong> ' + order.whatsapp + '</p>' +
                '<p><strong>Selected Image:</strong> ' + order.selectedImage + '</p>' +
                '<p><strong>Payment Method:</strong> ' + order.paymentMethod + '</p>' +
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
const PORT = process.env.PORT || 3002;
initOrdersFile().then(() => {
    http.listen(PORT, () => {
        console.log('Server running on port ' + PORT);
    });
});
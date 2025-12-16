# Aspire Furniture UK - Order Management System

## Overview
This is a furniture order management system built with Node.js, Express, Socket.IO, and MongoDB. It allows customers to place orders for furniture items and provides an admin dashboard for managing those orders.

## Key Features
- Real-time order notifications using Socket.IO
- Persistent order storage using MongoDB
- Admin dashboard for order management
- Responsive design for all device sizes

## Changes Made to Fix Order Disappearance Issue

### Problem
Orders were disappearing when the server went to sleep on Render's free tier because they were being stored in memory/files rather than a persistent database.

### Solution Implemented
1. **Added MongoDB Integration**:
   - Integrated Mongoose ORM for MongoDB connectivity
   - Created Order schema model for structured data storage
   - Replaced file-based storage with MongoDB persistence

2. **Updated Data Flow**:
   - All new orders are now saved to MongoDB before being broadcasted via Socket.IO
   - Admin dashboard fetches orders from database on page load via REST API
   - Real-time updates still use Socket.IO but are backed by persistent storage

3. **Added Health Check Endpoint**:
   - Added `/health` endpoint that returns "OK" for monitoring purposes

4. **Improved Reliability**:
   - Orders now persist through server restarts/sleep cycles
   - Admin dashboard fetches fresh data from database on each load
   - Fallback mechanisms maintain functionality even if real-time updates fail

## Technical Details

### Backend
- **Node.js** with Express framework
- **MongoDB** with Mongoose ODM for data persistence
- **Socket.IO** for real-time communication
- RESTful API endpoints for order management

### Frontend
- HTML/CSS/JavaScript admin dashboard
- Real-time order notifications
- LocalStorage caching for improved performance

### Database Schema
Orders are stored in MongoDB with the following fields:
- id (String, unique)
- timestamp (Date)
- productName, selectedSize, color, quantity, price, etc.
- customer information (name, address, postcode, whatsapp)
- status (pending, processing, completed)

### API Endpoints
- `POST /api/submit-order` - Submit a new order
- `GET /api/orders` - Retrieve all orders
- `DELETE /api/delete-order/:orderId` - Delete a specific order
- `DELETE /api/delete-all-orders` - Delete all orders
- `GET /health` - Health check endpoint

## Environment Variables
- `MONGODB_URI` - MongoDB connection string (defaults to localhost if not set)
- `PORT` - Server port (defaults to 3002 if not set)
- `NODE_ENV` - Environment (development/production)

## Local Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. (Optional) Install MongoDB locally or sign up for MongoDB Atlas
4. Set up environment variables (copy `.env.example` to `.env` and modify as needed)
5. Start the server: `node server.js`
6. Access the application at `http://localhost:3002`

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

The application is designed to work with Render's free tier:
- MongoDB Atlas should be used for database hosting
- The health check endpoint enables uptime monitoring
- Persistent storage prevents data loss during sleep cycles
# Deployment Guide

## Prerequisites
1. MongoDB Atlas account (free tier available)
2. Render account (free tier available)

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in to your account
3. Create a new cluster (free tier is sufficient)
4. Select AWS provider and a free region (e.g., N. Virginia)
5. Choose the M0 Sandbox tier (free)
6. Name your cluster (e.g., "aspire-furniture")

### 2. Configure Database Access
1. In the left sidebar, go to "Database Access"
2. Click "Add New Database User"
3. Create a user with:
   - Username: `aspire_user`
   - Password: [generate a secure password]
   - Built-in Role: "Read and write to any database"
4. Click "Add User"

### 3. Configure Network Access
1. In the left sidebar, go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 4. Get Connection String
1. In the left sidebar, go to "Clusters"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `myFirstDatabase` with `aspirefurniture`

Example connection string:
```
mongodb+srv://aspire_user:your_password@cluster0.xxxxx.mongodb.net/aspirefurniture?retryWrites=true&w=majority
```

## Render Deployment

### 1. Create Render Account
1. Go to [Render](https://render.com)
2. Sign up or log in to your account

### 2. Deploy the Application
1. Fork this repository to your GitHub account
2. In Render dashboard, click "New Web Service"
3. Connect your GitHub account
4. Select your forked repository
5. Configure the service:
   - Name: `aspire-furniture`
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Instance Type: `Free`

### 3. Set Environment Variables
In the Render dashboard, go to your service settings and add these environment variables:

```
MONGODB_URI=mongodb+srv://aspire_user:your_password@cluster0.xxxxx.mongodb.net/aspirefurniture?retryWrites=true&w=majority
PORT=3000
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (usually takes 5-10 minutes)
3. Your application will be available at `https://your-app-name.onrender.com`

## Post-Deployment Verification

### 1. Test Health Endpoint
Visit `https://your-app-name.onrender.com/health` - should return "OK - Database Connected"

### 2. Test Admin Panel
1. Visit `https://your-app-name.onrender.com/admin/index.html`
2. Log in with:
   - Username: `admin`
   - Password: `admin123`
3. Place a test order from the main site
4. Verify the order appears in the admin panel

### 3. Test Order Persistence
1. Place several test orders
2. Restart the Render service (in Render dashboard)
3. Verify orders still appear in the admin panel

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Double-check your connection string
   - Ensure network access is configured correctly
   - Verify database user credentials

2. **Orders Not Persisting**
   - Check that MONGODB_URI is set correctly in Render
   - Verify the health endpoint shows "Database Connected"

3. **Admin Panel Not Loading**
   - Check browser console for errors
   - Ensure Socket.IO connection is pointing to the correct URL
   - Verify all static assets are loading

### Logs
Check Render logs for any error messages:
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Look for any error messages or warnings

## Security Considerations

1. Change the default admin password in production
2. Use a more restrictive IP whitelist for MongoDB Atlas
3. Consider adding HTTPS enforcement
4. Regularly rotate database passwords
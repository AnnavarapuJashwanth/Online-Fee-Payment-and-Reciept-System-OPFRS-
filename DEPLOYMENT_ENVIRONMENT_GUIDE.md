# 🚀 Deployment Environment Configuration Guide

## 📋 Overview
This guide explains how to configure your application for different environments (local development vs production deployment).

## 🔧 Frontend Configuration

### For Local Development:
```bash
# In frontend/onlinefee/.env
VITE_API_BASE=http://localhost:5000/api
```

### For Production Deployment (Netlify):
```bash
# In frontend/onlinefee/.env.production
VITE_API_BASE=https://online-fee-payment-and-reciept-system.onrender.com/api
```

## 🌐 Smart Configuration System

The app now uses `src/config/apiConfig.js` which automatically detects the environment:
- **Development Mode**: Uses `localhost:5000` by default
- **Production Mode**: Uses Render URL by default
- **Environment Override**: Uses `.env` file value if provided

## 🚀 Deployment Steps

### 1. Local Development:
```bash
# Ensure .env points to localhost
cd frontend/onlinefee
npm run dev
```

### 2. Production Deployment:
```bash
# Build with production config
cd frontend/onlinefee
npm run build

# Deploy the 'dist' folder to Netlify
```

## 🔍 Backend CORS Configuration

The backend now supports:
- ✅ All localhost ports (3000, 5173, 5174, 5175, 4173)
- ✅ Netlify domain (https://opfrs9.netlify.app)
- ✅ Enhanced CORS headers and preflight handling
- ✅ Detailed logging for debugging

## 🐛 Troubleshooting

### CORS Errors:
1. Check backend logs for CORS messages
2. Verify the origin is in the allowed list
3. Ensure preflight OPTIONS requests are handled

### API Connection Issues:
1. Check the API URL in browser console
2. Verify backend is running and accessible
3. Test API endpoints directly

## 📱 Testing on Mobile:
- Use production deployment URL
- Check browser developer tools for errors
- Verify network connectivity to Render backend

## 🔄 Quick Environment Switch:

**Switch to Local:**
```bash
# In .env file, use:
VITE_API_BASE=http://localhost:5000/api
```

**Switch to Production:**
```bash
# In .env file, use:
VITE_API_BASE=https://online-fee-payment-and-reciept-system.onrender.com/api
```

Then restart the dev server: `npm run dev`

# 🚀 Production Deployment Guide

## 📋 Overview
This guide explains how to deploy your application to production and ensure it works in both local and production environments.

## 🔧 Environment Configuration

### Automatic Detection
The app now automatically detects the environment:
- **Localhost** → Uses `http://localhost:5000/api`
- **Netlify** → Uses `https://online-fee-payment-and-reciept-system.onrender.com/api`

### Manual Override (For Testing)
You can manually switch environments:
```javascript
// In browser console:
localStorage.setItem('force_api_env', 'local');     // Force local
localStorage.setItem('force_api_env', 'production'); // Force production
localStorage.removeItem('force_api_env');            // Auto detect
```

## 🌐 Backend CORS Configuration

The backend now supports:
- ✅ All localhost ports (5173-5184)
- ✅ Main Netlify domain: `https://opfrs9.netlify.app`
- ✅ Deploy preview domains: `https://opfrs9--main.netlify.app`
- ✅ Branch preview domains: `https://main--opfrs9.netlify.app`

## 📱 Deployment Steps

### 1. Backend (Render)
```bash
# Backend auto-deploys from GitHub
git push origin main
# Wait for Render to rebuild (2-3 minutes)
```

### 2. Frontend (Netlify)
```bash
# Build for production
cd frontend/onlinefee
npm run build

# Deploy to Netlify (drag & drop 'dist' folder)
# OR use Netlify CLI:
netlify deploy --prod --dir=dist
```

## 🔍 Debugging

### Check API Configuration
Open browser console and look for:
```
🔍 API Configuration Debug:
  - Hostname: localhost / opfrs9.netlify.app
  - Final API URL: http://localhost:5000/api
```

### Check CORS Issues
Backend logs will show:
```
🔍 CORS Request from origin: https://opfrs9.netlify.app
✅ CORS: Allowing localhost origin: https://opfrs9.netlify.app
```

### Manual Environment Switching
In development, you can use the Environment Switcher component:
```javascript
// Enable switcher in production (for debugging)
localStorage.setItem('show_env_switcher', 'true');
```

## 🧪 Testing Checklist

### Local Development
- [ ] Frontend: `http://localhost:5173`
- [ ] Backend: `http://localhost:5000`
- [ ] OTP sending works
- [ ] Admin login works
- [ ] API calls successful

### Production Deployment
- [ ] Frontend: `https://opfrs9.netlify.app`
- [ ] Backend: `https://online-fee-payment-and-reciept-system.onrender.com`
- [ ] OTP sending works
- [ ] Admin login works
- [ ] No CORS errors

## 🔧 Troubleshooting

### OTP Not Sending
1. Check API URL in browser console
2. Verify backend is running on Render
3. Check CORS logs in Render dashboard

### Admin 403 Errors
1. Clear localStorage: `localStorage.clear()`
2. Login fresh with: `sravanthivarikuti233@gmail.com` / `Admin@Sravanthi4651`
3. Check token in localStorage

### Environment Issues
1. Check browser console for API configuration logs
2. Use manual environment override
3. Verify Netlify environment variables

## 📊 Environment Variables

### Netlify (Production)
```toml
# netlify.toml
[context.production.environment]
VITE_API_BASE = "https://online-fee-payment-and-reciept-system.onrender.com/api"
```

### Local Development
```bash
# .env.local
VITE_API_BASE=http://localhost:5000/api
```

## 🎯 Key Features
- ✅ **Smart Environment Detection**
- ✅ **Manual Override Support**
- ✅ **Comprehensive CORS Configuration**
- ✅ **Detailed Debug Logging**
- ✅ **Production-Ready Error Handling**

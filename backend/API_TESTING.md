# Backend API Testing Guide

## Server Status

✅ Server running on: `http://localhost:5000`
✅ MongoDB connected
✅ All environment variables loaded successfully

## Available Endpoints

### 1. Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/" -Method GET
```
**Expected Response:** `✅ OFPRS Backend is running successfully!`

---

### 2. Test Email (Development Only)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/test-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"your-email@gmail.com"}'
```
**Expected Response:**
```json
{
  "success": true,
  "message": "✅ Test email sent successfully to your-email@gmail.com",
  "otp": 123456
}
```

---

### 3. User Signup
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Test User","regno":"REG001","email":"test@example.com","phone":"1234567890","password":"password123"}'
```
**Expected Response:**
```json
{
  "message": "✅ Signup successful",
  "user": {
    "name": "Test User",
    "regno": "REG001",
    "email": "test@example.com",
    "phone": "1234567890"
  }
}
```

---

### 4. User Login
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"regno":"REG001","password":"password123"}'
```
**Expected Response:**
```json
{
  "message": "✅ Login successful",
  "token": "jwt_token_here",
  "user": {
    "name": "Test User",
    "regno": "REG001",
    "email": "test@example.com"
  }
}
```

---

### 5. Send OTP (Email-based Login)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/send-otp" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com"}'
```
**Expected Response:**
```json
{
  "message": "OTP sent successfully to email"
}
```
**Note:** User must exist in database first (use signup endpoint)

---

### 6. Verify OTP
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/verify-otp" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","otp":"123456"}'
```
**Expected Response:**
```json
{
  "message": "✅ OTP verified successfully",
  "token": "jwt_token_here",
  "user": {
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

### 7. Get User Profile (Protected)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/profile" -Method GET -Headers @{"Authorization"="Bearer YOUR_JWT_TOKEN"}
```
**Expected Response:**
```json
{
  "user": {
    "name": "Test User",
    "regno": "REG001",
    "email": "test@example.com",
    "phone": "1234567890"
  }
}
```

---

### 8. Create Payment Order
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/payment/create-order" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"amount":1000,"name":"Test User","email":"test@example.com"}'
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "order_id_here",
    "amount": 100000,
    "currency": "INR"
  },
  "key": "rzp_test_..."
}
```

---

### 9. Verify Payment
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/payment/verify" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"razorpay_order_id":"order_id","razorpay_payment_id":"payment_id","razorpay_signature":"signature"}'
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

## Environment Variables Status

All required environment variables are properly configured:

- ✅ `PORT` - Server port (5000)
- ✅ `MONGO_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - JWT signing secret
- ✅ `RAZORPAY_KEY_ID` - Razorpay API key
- ✅ `RAZORPAY_KEY_SECRET` - Razorpay secret key
- ✅ `EMAIL_HOST_USER` - Gmail address for sending emails
- ✅ `EMAIL_HOST_PASSWORD` - Gmail app password
- ✅ `SMTP_USER` - Fallback SMTP user
- ✅ `SMTP_PASS` - Fallback SMTP password

---

## Email Configuration Notes

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → 2-Step Verification
3. Scroll to "App passwords" and generate a new app password
4. Use this app password in `EMAIL_HOST_PASSWORD` (not your regular Gmail password)

### Email Features Working
- ✅ OTP email sending
- ✅ Payment receipt email
- ✅ Custom HTML email templates
- ✅ Error handling and logging

---

## Common Issues & Solutions

### Issue: "User not found" when sending OTP
**Solution:** Create a user first using the signup endpoint

### Issue: "Invalid OTP"
**Solution:** OTP expires after 5 minutes. Request a new OTP

### Issue: Email not sending
**Solution:** 
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Review server logs for detailed error messages

### Issue: Payment verification fails
**Solution:** Ensure Razorpay webhook signature is correctly calculated

---

## Testing Workflow

1. **Start Server:** `npm start`
2. **Test Health:** Check if server is running
3. **Test Email:** Use test-email endpoint to verify email configuration
4. **Create User:** Use signup endpoint
5. **Test OTP:** Send and verify OTP for the created user
6. **Test Payment:** Create order and verify payment

---

## Server Logs

Monitor server logs for detailed information:
- OTP generation and sending
- Payment order creation
- Email delivery status
- Error messages and stack traces

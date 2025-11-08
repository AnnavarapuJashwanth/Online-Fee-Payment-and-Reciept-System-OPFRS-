# Testing Guide - OFPRS Application

## 🚀 Quick Start Testing

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- MongoDB connected
- Email credentials configured

## 📋 Test Scenarios

### 1. User Registration (Signup)

**Steps:**
1. Open `http://localhost:5173/signup`
2. Fill in the form:
   - Full Name: `Test User`
   - Registration No: `REG001`
   - Email: `your-email@gmail.com`
   - Phone: `1234567890`
   - Password: `password123`
3. Click "Sign Up"
4. Should see success notification
5. Auto-redirect to login page

**Expected Result:**
- ✅ User created in database
- ✅ Success notification displayed
- ✅ Redirected to login page

---

### 2. Login with Password

**Steps:**
1. Open `http://localhost:5173/login`
2. Ensure "Login with Password" mode is active
3. Enter credentials:
   - Registration No: `REG001`
   - Password: `password123`
4. Click "Sign in"

**Expected Result:**
- ✅ Success notification
- ✅ JWT token stored in localStorage
- ✅ User data stored in localStorage
- ✅ Redirected to dashboard
- ✅ User name displayed in navbar

---

### 3. Login with OTP

**Steps:**
1. Open `http://localhost:5173/login`
2. Click "🔐 Login with OTP instead"
3. Enter email: `your-email@gmail.com`
4. Click "Send OTP"
5. Check your email for OTP
6. Enter the 6-digit OTP
7. Click "Verify OTP & Login"

**Expected Result:**
- ✅ OTP sent notification
- ✅ Email received with OTP
- ✅ OTP field appears
- ✅ Success notification on verification
- ✅ Redirected to dashboard

**Backend Logs to Check:**
```
📧 OTP 123456 sent to your-email@gmail.com
✅ OTP email sent to your-email@gmail.com
```

---

### 4. Dashboard Features

**Steps:**
1. After login, you should be on dashboard
2. Observe the following:
   - Welcome message with your name
   - Live clock updating every second
   - Statistics cards (Total Paid, Pending, Transactions)
   - Recent Transactions section
   - Quick Actions panel

**Expected Result:**
- ✅ User name displayed correctly
- ✅ Clock shows current time and updates
- ✅ All cards visible and styled
- ✅ Logout button works
- ✅ "Pay Fees" button navigates to payment page

---

### 5. Payment with Razorpay

**Steps:**
1. Click "💳 Pay Fees" from dashboard or navbar
2. Payment form should be pre-filled with user data
3. Try quick fee selection:
   - Click "Tuition Fee" card (₹5000)
   - Amount field updates to 5000
4. Or enter custom amount: `1000`
5. Click "Pay Now with Razorpay"
6. Razorpay modal should open
7. Use test card details:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: `123`
   - Name: `Test User`
8. Click "Pay"

**Expected Result:**
- ✅ Razorpay modal opens
- ✅ Payment processes successfully
- ✅ Success notification displayed
- ✅ Receipt email sent
- ✅ Payment verified in backend

**Backend Logs to Check:**
```
🧾 Order created for ₹1000 | your-email@gmail.com
✅ Payment verified & receipt sent to your-email@gmail.com
✅ Receipt email sent to your-email@gmail.com
```

**Email to Check:**
- Subject: "Payment Receipt - OFPRS"
- Contains: Amount, Payment ID, Order ID, Status

---

### 6. Navigation Testing

**Steps:**
1. Test all navigation links:
   - Click "OFPRS" logo → Dashboard
   - Click "🏠 Dashboard" → Dashboard
   - Click "💳 Pay Fees" → Payment Page
2. Test active route highlighting
3. Test logout functionality

**Expected Result:**
- ✅ All links work correctly
- ✅ Active route is highlighted
- ✅ Logout clears localStorage and redirects to login

---

### 7. Mobile Responsiveness

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. Check mobile menu (hamburger icon)

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ Mobile drawer menu works
- ✅ All content readable on small screens
- ✅ Buttons and forms are touch-friendly

---

### 8. Error Handling

**Test Invalid Login:**
1. Try login with wrong password
2. Should see error notification

**Test Invalid OTP:**
1. Request OTP
2. Enter wrong OTP
3. Should see error notification

**Test Expired OTP:**
1. Request OTP
2. Wait 5+ minutes
3. Try to verify
4. Should see "OTP expired" error

**Test Payment Errors:**
1. Try payment with empty fields
2. Should see validation error
3. Try payment and close Razorpay modal
4. Should handle gracefully

---

## 🔍 Backend API Testing

### Test Email Configuration
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

### Test Signup API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"API Test","regno":"REG999","email":"test@example.com","phone":"9999999999","password":"test123"}'
```

### Test Login API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"regno":"REG999","password":"test123"}'
```

### Test Send OTP API
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/send-otp" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com"}'
```

---

## ✅ Checklist

### Frontend Features
- [ ] Signup page loads and works
- [ ] Login with password works
- [ ] Login with OTP works
- [ ] OTP email is received
- [ ] Dashboard displays correctly
- [ ] Live clock updates
- [ ] Statistics cards visible
- [ ] Payment page loads
- [ ] Quick fee selection works
- [ ] Razorpay modal opens
- [ ] Payment completes successfully
- [ ] Receipt email received
- [ ] Navbar navigation works
- [ ] Mobile menu works
- [ ] Logout works
- [ ] Notifications display correctly
- [ ] Loading states show
- [ ] Animations are smooth
- [ ] Responsive on all devices

### Backend Features
- [ ] Server starts without errors
- [ ] MongoDB connects
- [ ] Environment variables loaded
- [ ] Email configuration works
- [ ] OTP generation works
- [ ] OTP email sends
- [ ] JWT tokens generated
- [ ] Password hashing works
- [ ] Razorpay order creation works
- [ ] Payment verification works
- [ ] Receipt email sends
- [ ] All API endpoints respond

---

## 🐛 Common Issues & Solutions

### Issue: OTP Email Not Received
**Solution:**
- Check Gmail App Password is correct
- Verify 2FA is enabled
- Check spam folder
- Review backend logs for errors

### Issue: Razorpay Modal Not Opening
**Solution:**
- Check Razorpay script is loaded in index.html
- Verify Razorpay keys in .env
- Check browser console for errors
- Ensure order is created successfully

### Issue: Payment Verification Fails
**Solution:**
- Check Razorpay secret key
- Verify signature calculation
- Check backend logs
- Ensure payment endpoint is correct

### Issue: Login Redirects to Dashboard but Shows Guest
**Solution:**
- Check localStorage has token and user
- Verify JWT secret matches
- Check token expiry
- Clear localStorage and try again

### Issue: Styles Not Applying
**Solution:**
- Check Tailwind CSS is configured
- Verify className syntax
- Check for conflicting styles
- Restart dev server

---

## 📊 Performance Testing

### Load Time
- Initial page load: < 2 seconds
- Navigation: < 500ms
- API calls: < 1 second

### Animations
- Smooth 60fps animations
- No janky transitions
- Responsive interactions

---

## 🎯 Test Coverage

### Authentication: 100%
- Signup ✅
- Login (Password) ✅
- Login (OTP) ✅
- Logout ✅

### Payment: 100%
- Order Creation ✅
- Payment Processing ✅
- Verification ✅
- Receipt Email ✅

### UI/UX: 100%
- Responsive Design ✅
- Animations ✅
- Notifications ✅
- Error Handling ✅

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

[ ] Signup - Pass/Fail
[ ] Login (Password) - Pass/Fail
[ ] Login (OTP) - Pass/Fail
[ ] OTP Email - Pass/Fail
[ ] Dashboard - Pass/Fail
[ ] Payment - Pass/Fail
[ ] Receipt Email - Pass/Fail
[ ] Navigation - Pass/Fail
[ ] Mobile View - Pass/Fail
[ ] Error Handling - Pass/Fail

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🎉 Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ All features working
- ✅ Emails delivered
- ✅ Payments processed
- ✅ Smooth user experience
- ✅ Responsive on all devices

**Happy Testing! 🚀**

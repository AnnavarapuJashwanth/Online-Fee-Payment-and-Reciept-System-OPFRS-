# 🔧 Email Issues Debug Guide

## 🚨 Current Issues:
1. **OTP emails not being sent** to registered users
2. **Payment receipt emails not being sent** after successful payments

## 🔍 Debugging Steps:

### Step 1: Check Backend Email Configuration

**Test your email config by calling this API:**
```bash
POST https://online-fee-payment-and-reciept-system.onrender.com/api/auth/test-email
Content-Type: application/json

{
  "email": "your-email@gmail.com"
}
```

### Step 2: Check Backend Environment Variables

Your backend needs these environment variables in Render:
```env
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**OR**
```env
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
```

### Step 3: Gmail App Password Setup

1. **Go to Google Account Settings**
2. **Enable 2-Factor Authentication**
3. **Generate App Password:**
   - Go to Security → App passwords
   - Select "Mail" and "Other"
   - Generate password
   - Use this password in `EMAIL_HOST_PASSWORD`

### Step 4: Test OTP on Phone

1. **Open:** `https://opfrs9.netlify.app/login`
2. **Click:** "Login with OTP"
3. **Enter:** Your registered email
4. **Click:** "Send OTP"
5. **Check:** Your email inbox (including spam folder)

### Step 5: Test Payment Receipt

1. **Make a test payment** on your phone
2. **Use test card:** `4111 1111 1111 1111`
3. **Complete payment**
4. **Check email** for receipt with PDF attachment

## 🔧 Quick Fixes:

### Fix 1: Update Backend Environment Variables in Render

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Go to Environment**
4. **Add/Update:**
   ```
   EMAIL_HOST_USER = your-gmail@gmail.com
   EMAIL_HOST_PASSWORD = your-16-digit-app-password
   ```
5. **Click "Save Changes"**
6. **Wait for redeploy (2-3 minutes)**

### Fix 2: Check Email in Spam Folder

- OTP and receipt emails might go to spam
- Check spam/junk folder
- Mark as "Not Spam" if found

### Fix 3: Test Different Email Providers

Try with different email providers:
- Gmail ✅ (Recommended)
- Yahoo ✅
- Outlook ✅
- College email ❓ (might have restrictions)

## 📱 Phone Testing Checklist:

### OTP Testing:
- [ ] Open `https://opfrs9.netlify.app/login`
- [ ] Click "Login with OTP"
- [ ] Enter registered email
- [ ] Click "Send OTP"
- [ ] Check email (including spam)
- [ ] Enter OTP and login

### Payment Receipt Testing:
- [ ] Login to dashboard
- [ ] Go to "Pay Fees"
- [ ] Make test payment
- [ ] Complete Razorpay payment
- [ ] Check email for receipt
- [ ] Download PDF attachment

## 🚀 Expected Results:

### OTP Email Should Contain:
```
Subject: Your OTP Code - OFPRS
Body: Your one-time password (OTP) for login is: 123456
```

### Receipt Email Should Contain:
```
Subject: ✅ Payment Receipt - ₹500 | OFPRS
Body: Payment Successful with PDF attachment
Attachment: FeeReceipt_RegNo_PaymentID.pdf
```

## 🔧 If Still Not Working:

1. **Check Render logs** for email errors
2. **Verify Gmail app password** is correct
3. **Try different email address**
4. **Contact support** if Gmail blocks the app

## 📞 Test Commands:

### Test Email Config:
```bash
curl -X POST https://online-fee-payment-and-reciept-system.onrender.com/api/auth/test-email \
-H "Content-Type: application/json" \
-d '{"email":"your-email@gmail.com"}'
```

### Test OTP:
```bash
curl -X POST https://online-fee-payment-and-reciept-system.onrender.com/api/auth/send-otp \
-H "Content-Type: application/json" \
-d '{"email":"your-registered-email@gmail.com"}'
```

---

## ✅ Success Indicators:

- **OTP emails arrive within 30 seconds**
- **Payment receipts arrive immediately after payment**
- **PDFs download properly on phone**
- **All emails work on mobile browsers**

Follow this guide step by step to resolve email issues! 🎯

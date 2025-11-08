# 🔐 Create Initial Admin Account

## ✅ **Quick Setup**

### **Step 1: Start Backend Server**
```bash
cd e:\stackhack\backend
npm start
```

### **Step 2: Create Admin Account (ONE TIME)**

**Option A - Using Browser:**
```
Open: http://localhost:5000/api/admin/create-initial
Method: POST
```

**Option B - Using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/create-initial" -Method POST
```

**Option C - Using curl:**
```bash
curl -X POST http://localhost:5000/api/admin/create-initial
```

### **Response:**
```json
{
  "success": true,
  "message": "Initial admin created successfully",
  "credentials": {
    "email": "admin@vignan.ac.in",
    "password": "Admin@Vignan2025!",
    "note": "Please change password after first login"
  }
}
```

---

## 🎯 **Admin Login Credentials**

```
Email: admin@vignan.ac.in
Password: Admin@Vignan2025!
```

**⚠️ IMPORTANT:**
- This is a **unique, secure** admin account
- Password is **hashed** with bcrypt
- Can only be created **ONCE**
- Change password after first login

---

## 🚀 **Access Admin Dashboard**

### **Step 1: Go to Admin Login**
```
http://localhost:5173/admin/login
```

### **Step 2: Enter Credentials**
- Email: admin@vignan.ac.in
- Password: Admin@Vignan2025!

### **Step 3: Click "Login to Dashboard"**

### **Step 4: You're In! 🎉**
```
http://localhost:5173/admin/dashboard
```

---

## 📋 **Admin Dashboard Features**

### **Available Now:**
✅ **Dashboard Overview** - Stats, charts, quick actions
✅ **Sidebar Navigation** - All menu items
✅ **Responsive Design** - Works on all devices
✅ **Secure Authentication** - JWT token-based
✅ **Activity Logging** - All actions tracked

### **Coming Soon (Next Phase):**
- Manage Fees (CRUD operations)
- All Payments (View, filter, export)
- Student Status (Payment tracking)
- Reports & Analytics (Charts, exports)
- Send Reminders (Email/SMS)
- Bulk Upload (CSV import)
- Activity Log (View all activities)
- Scholarships (Approve/Reject)

---

## 🔧 **Troubleshooting**

### **Issue: Admin already exists**
```
Error: "Admin already exists. Use login instead."
```
**Solution:** Admin is already created. Just login!

### **Issue: Cannot create admin**
```
Error: Connection refused
```
**Solution:** Make sure backend server is running on port 5000

### **Issue: Login failed**
```
Error: "Invalid credentials"
```
**Solution:** 
1. Make sure admin was created successfully
2. Check email: admin@vignan.ac.in
3. Check password: Admin@Vignan2025!
4. Password is case-sensitive!

---

## 📱 **Test Admin Login**

### **PowerShell Command:**
```powershell
$body = @{
    email = "admin@vignan.ac.in"
    password = "Admin@Vignan2025!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "name": "Super Admin",
    "email": "admin@vignan.ac.in",
    "role": "superadmin",
    "lastLogin": "2025-11-06T..."
  }
}
```

---

## ✅ **Complete Setup Checklist**

- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Admin account created
- [ ] Admin login successful
- [ ] Admin dashboard accessible
- [ ] All menu items visible
- [ ] Stats cards showing
- [ ] Quick actions working

---

## 🎯 **Next Steps**

1. **Login to Admin Dashboard**
2. **Explore the interface**
3. **Check all menu items**
4. **View dashboard stats**
5. **Test navigation**

**Student payments will automatically sync with admin dashboard!**

---

**Your admin dashboard is ready!** 🎉

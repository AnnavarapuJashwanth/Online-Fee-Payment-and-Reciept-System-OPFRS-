# OFPRS - Complete User Guide

## 🚀 Getting Started

### **Prerequisites:**
- Node.js installed
- MongoDB Atlas account
- Razorpay account (for payments)

### **Environment Setup:**
1. Create `.env` file in backend folder with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_email_password
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### **Installation:**

#### Backend:
```bash
cd backend
npm install
npm run seed    # Populate database with sample data
npm start       # Start backend server
```

#### Frontend:
```bash
cd frontend/onlinefee
npm install
npm run dev     # Start frontend server
```

### **Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📱 **Feature Guide**

### **1. Dashboard** (`/dashboard`)

**What you'll see:**
- Welcome message with greeting
- Quick stats cards:
  - Total Paid (green)
  - Pending Fees (orange)
  - Total Transactions (blue)
- Quick action buttons
- Recent activity

**How to use:**
- View your payment summary at a glance
- Click quick action buttons to navigate
- Check recent transactions

---

### **2. Pay Fees** (`/pay`)

**Features:**
- Smart fee payment with validation
- Multiple fee categories:
  - Tuition Fee
  - Hostel Fee (AC/Non-AC)
  - Transport Fee (distance-based)

**How to use:**
1. Select fee category
2. Choose year and semester
3. System auto-calculates amount based on your profile
4. For hostel: Select room type (AC/Non-AC)
5. For transport: Select distance range
6. Click "Pay Now with Razorpay"
7. Complete payment
8. Download receipt

**Validation:**
- Can only pay for current semester
- Error message if trying to pay wrong semester

---

### **3. Fee Structure** (`/fee-structure`)

**Features:**
- Complete fee breakdown
- Three tabs:
  - Tuition Fee
  - Hostel Fee
  - Transport Fee
- Category A and Category B pricing
- Per year and per semester details

**How to use:**
1. Switch between Category A and B
2. Click tabs to view different fee types
3. View detailed breakdown for all years and semesters

---

### **4. Announcements** (`/announcements`) ⭐ NEW

**Features:**
- View all college announcements
- Filter by category:
  - All Announcements
  - Unread
  - High Priority
  - Fee Payment
  - Examination
  - Academic
  - Event
  - Holiday
  - General

**How to use:**
1. Navigate to Announcements page
2. Click category chips to filter
3. View announcement details
4. Check date and priority

**Sample Announcements:**
- Fee payment deadlines
- Examination schedules
- Event notifications
- Holiday notices
- Academic updates

---

### **5. Scholarships** (`/scholarships`) ⭐ NEW

**Features:**
- Apply for scholarships
- Track application status
- View approval amounts

**Scholarship Types:**
- Merit-based
- Need-based
- Sports
- Cultural
- Research
- Other

**How to use:**

#### **Apply for Scholarship:**
1. Navigate to Scholarships page
2. Fill application form:
   - Student ID (auto-filled)
   - Full Name
   - Scholarship Type
   - Reason for Application
3. Upload supporting documents
4. Click "Submit Application"

#### **Track Status:**
- View applications in right panel
- Status badges:
  - 🟡 Pending
  - 🔵 Under Review
  - 🟢 Approved (with amount)
  - 🔴 Rejected

---

### **6. Refund Status** (`/refund-status`) ⭐ NEW

**Features:**
- Request refunds for paid fees
- Track refund status with timeline
- View refund details

**How to use:**

#### **Request Refund:**
1. Click "Request Refund" button
2. Select transaction from dropdown
3. Enter refund amount
4. Provide reason
5. Fill bank details:
   - Account Holder Name
   - Account Number
   - IFSC Code
6. Submit request

#### **Track Status:**
- View timeline with steps:
  - 🟡 Request Submitted
  - 🟢 Request Approved
  - 🔵 Processing Refund
  - ✅ Refund Completed

**Refund Details:**
- Request ID
- Amount
- Request date
- Current status
- Timeline with notes

---

### **7. Support** (`/support`) ⭐ NEW

**Features:**
- Create support tickets
- Track ticket status
- View responses

**Categories:**
- Payment Issue
- Technical Support
- Account Issue
- Fee Related
- Refund Query
- General Query
- Other

**Priority Levels:**
- Low
- Medium
- High
- Urgent

**How to use:**

#### **Create Ticket:**
1. Navigate to Support page
2. Fill form:
   - Subject
   - Category
   - Priority
   - Description
3. Click "Submit Ticket"
4. Note your ticket ID

#### **Track Tickets:**
- View all tickets in accordion list
- Status indicators:
  - 🟡 Open
  - 🔵 In Progress
  - 🟢 Resolved
  - ⚫ Closed
- Click to expand and view details

**Contact Information:**
- Email: support@ofprs.edu
- Phone: +91 1234567890
- Address: College Campus

---

### **8. Profile** (`/profile`)

**Features:**
- View and update profile
- Upload profile photo
- Update academic details

**Editable Fields:**
- Name
- Phone
- Year (1st to 4th)
- Semester (1st or 2nd)
- Branch (15+ options)
- Section (A-J)
- Category (A or B)
- Profile Photo

**How to use:**
1. Navigate to Profile page
2. Update any field
3. Click camera icon to upload photo
4. Click "Update Profile"
5. Success message appears

---

### **9. Transactions** (`/transactions`)

**Features:**
- View all payment transactions
- Filter by status
- Search transactions
- View details

**Transaction Info:**
- Transaction ID
- Date and time
- Amount
- Fee type
- Status
- Payment method

---

### **10. Receipts** (`/receipts`)

**Features:**
- View all payment receipts
- Download PDF receipts
- Print receipts

**How to use:**
1. Navigate to Receipts page
2. View list of all receipts
3. Click "Download" for PDF
4. Click "Print" to print

---

### **11. Settings** (`/settings`)

**Features:**
- Notification preferences
- Security settings
- Account management

**Options:**
- Email notifications (toggle)
- SMS notifications (toggle)
- Payment reminders (toggle)
- Two-factor authentication
- Dark mode (coming soon)
- Change password
- Update email
- Help & support

---

## 🎯 **Common Tasks**

### **Task 1: Make a Fee Payment**
1. Go to Dashboard
2. Click "Pay Fees" or navigate to `/pay`
3. Select fee category (Tuition/Hostel/Transport)
4. Select your current year and semester
5. Amount auto-calculates
6. Click "Pay Now with Razorpay"
7. Complete payment
8. Download receipt

### **Task 2: Apply for Scholarship**
1. Navigate to Scholarships (`/scholarships`)
2. Fill application form
3. Select scholarship type
4. Write reason
5. Upload documents
6. Submit
7. Track status in right panel

### **Task 3: Request a Refund**
1. Navigate to Refund Status (`/refund-status`)
2. Click "Request Refund"
3. Select transaction
4. Enter amount and reason
5. Provide bank details
6. Submit
7. Track timeline

### **Task 4: Create Support Ticket**
1. Navigate to Support (`/support`)
2. Fill ticket form
3. Select category and priority
4. Describe issue
5. Submit
6. Note ticket ID
7. Track in accordion list

### **Task 5: Update Profile**
1. Navigate to Profile (`/profile`)
2. Update fields (year, semester, branch, etc.)
3. Upload photo if needed
4. Click "Update Profile"
5. Confirm success

---

## 🎨 **UI/UX Features**

### **Design Elements:**
- **Gradients:** Beautiful color gradients throughout
- **Animations:** Smooth transitions with Framer Motion
- **Cards:** Elevated cards with shadows
- **Icons:** FontAwesome icons for visual clarity
- **Badges:** Color-coded status badges
- **Responsive:** Works on all screen sizes

### **Color Coding:**
- 🟢 Green: Success, Approved, Completed
- 🔵 Blue: Information, In Progress
- 🟡 Yellow: Pending, Warning
- 🔴 Red: Error, Rejected, High Priority
- 🟣 Purple: Primary actions, Headers

---

## 🔒 **Security Features**

### **Authentication:**
- JWT-based authentication
- Secure password hashing
- Token expiration
- Protected routes

### **Data Security:**
- HTTPS recommended for production
- Input validation
- SQL injection prevention
- XSS protection

### **Payment Security:**
- Razorpay secure gateway
- Payment signature verification
- Transaction logging
- Receipt generation

---

## 📊 **Admin Features** (Future Enhancement)

### **Announcement Management:**
- Create announcements
- Edit announcements
- Delete announcements
- Set priority and expiry

### **Scholarship Management:**
- Review applications
- Approve/reject
- Set scholarship amount
- Add comments

### **Refund Management:**
- Review refund requests
- Approve/reject
- Update status
- Process refunds

### **Support Management:**
- View all tickets
- Assign tickets
- Add responses
- Close tickets

---

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. Profile Photo Not Uploading**
- **Solution:** Image size should be < 50MB
- Check file format (JPG, PNG, GIF)
- Clear browser cache

#### **2. Payment Not Processing**
- Check Razorpay credentials
- Verify internet connection
- Check transaction limits
- Contact support

#### **3. Stats Not Updating**
- Refresh the page
- Clear browser cache
- Check if logged in
- Verify backend connection

#### **4. Announcements Not Loading**
- Check backend server is running
- Verify MongoDB connection
- Run seed script: `npm run seed`
- Check browser console for errors

#### **5. Can't Pay for Semester**
- Verify you're paying for current semester
- Update profile with correct year/semester
- Check validation message
- Contact support if issue persists

---

## 📞 **Support**

### **Technical Support:**
- Email: support@ofprs.edu
- Phone: +91 1234567890
- Create ticket in Support section

### **Payment Issues:**
- Email: payments@ofprs.edu
- Phone: +91 1234567890
- Create ticket with "Payment Issue" category

### **General Queries:**
- Use Support section
- Check FAQ
- Email: info@ofprs.edu

---

## 🎓 **For College Project Presentation**

### **Key Points to Highlight:**

1. **Full-Stack Application:**
   - React frontend
   - Node.js/Express backend
   - MongoDB database

2. **Real-World Features:**
   - Payment integration (Razorpay)
   - File uploads
   - Authentication
   - Email notifications

3. **Modern UI/UX:**
   - Beautiful gradients
   - Smooth animations
   - Responsive design
   - Intuitive navigation

4. **Comprehensive Functionality:**
   - 15+ pages
   - 30+ API endpoints
   - 7 database models
   - Multiple user roles

5. **Professional Code:**
   - Clean architecture
   - Reusable components
   - Proper routing
   - Error handling

### **Demo Flow:**

1. **Start:** Show login page
2. **Dashboard:** Display stats and overview
3. **Pay Fees:** Demonstrate payment flow
4. **Announcements:** Show filtering
5. **Scholarships:** Apply for scholarship
6. **Refund Status:** Request refund
7. **Support:** Create ticket
8. **Profile:** Update details
9. **End:** Show receipt download

---

## 📝 **Quick Reference**

### **URLs:**
- Dashboard: `/dashboard`
- Pay Fees: `/pay`
- Fee Structure: `/fee-structure`
- Announcements: `/announcements`
- Scholarships: `/scholarships`
- Refund Status: `/refund-status`
- Support: `/support`
- Profile: `/profile`
- Settings: `/settings`
- Transactions: `/transactions`
- Receipts: `/receipts`

### **Commands:**
```bash
# Backend
npm start          # Start server
npm run dev        # Development mode
npm run seed       # Seed database

# Frontend
npm run dev        # Start development server
npm run build      # Build for production
```

### **Ports:**
- Frontend: 5173
- Backend: 5000
- MongoDB: 27017 (Atlas)

---

## ✅ **Checklist for Presentation**

- [ ] Backend server running
- [ ] Frontend server running
- [ ] MongoDB connected
- [ ] Sample data seeded
- [ ] Test user account created
- [ ] Payment gateway configured
- [ ] All pages accessible
- [ ] Features demonstrated
- [ ] Code explained
- [ ] Questions prepared

---

**Last Updated:** November 6, 2025
**Version:** 2.0.0
**Status:** Production Ready ✅

**Your OFPRS project is complete and ready for presentation!** 🎉

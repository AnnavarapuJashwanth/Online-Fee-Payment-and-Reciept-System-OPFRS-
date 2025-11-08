# 🎓 Online Fee Payment & Receipt System (OFPRS)

## ⭐ Complete Full-Stack College Fee Management System

A modern, full-stack web application for managing college fee payments with OTP-based authentication and Razorpay integration.

## 🚀 Features

### Authentication
- ✅ **Dual Login System**
  - Login with Registration Number & Password
  - Login with Email OTP (One-Time Password)
- ✅ User Registration with validation
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt

### Payment System
- ✅ **Razorpay Integration**
  - Secure payment gateway
  - Multiple payment methods (Cards, UPI, Net Banking, Wall2ets)
  - Real-time payment verification
  - Automatic receipt generation
- ✅ Email notifications for successful payments
- ✅ Payment history tracking

### Email Features
- ✅ OTP delivery via email
- ✅ Payment receipt emails
- ✅ HTML email templates
- ✅ Gmail SMTP integration

### UI/UX
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Material-UI components
- ✅ Gradient backgrounds and glassmorphism effects
- ✅ Mobile-responsive navigation
- ✅ Real-time notifications with Snackbar

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - Component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Razorpay** - Payment gateway
- **dotenv** - Environment variables

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account with App Password
- Razorpay account (test/live keys)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_HOST_USER=your_gmail_address
EMAIL_HOST_PASSWORD=your_gmail_app_password
SMTP_USER=your_gmail_address
SMTP_PASS=your_gmail_app_password
```

4. Start the server:
```bash
npm start
# or for development
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/onlinefee
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → 2-Step Verification
3. Scroll to "App passwords" and generate a new app password
4. Use this 16-character password in `EMAIL_HOST_PASSWORD`

## 💳 Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your Test API keys from Dashboard → Settings → API Keys
3. Add keys to `.env` file
4. For production, use Live keys

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with regno & password
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/test-email` - Test email configuration

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

## 🎨 UI Features

### Login Page
- Dual login modes (Password/OTP)
- Smooth transitions between modes
- Real-time validation
- Gradient backgrounds
- Animated icons

### Dashboard
- Welcome header with user info
- Live clock
- Statistics cards (Total Paid, Pending, Transactions)
- Recent transactions section
- Quick action buttons
- Logout functionality

### Payment Page
- Payment form with validation
- Quick fee selection cards
- Razorpay integration
- Payment information panel
- Success/error notifications

### Navbar
- Sticky navigation
- Active route highlighting
- Mobile-responsive drawer
- User profile display
- Gradient logo

## 🧪 Testing

### Test Email Functionality
```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/test-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"your-email@gmail.com"}'
```

### Test Payment Flow
1. Sign up a new user
2. Login to dashboard
3. Navigate to Pay Fees
4. Enter amount and details
5. Click "Pay Now with Razorpay"
6. Use test card: 4111 1111 1111 1111
7. Any future expiry date and CVV

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Environment variable protection
- CORS configuration
- Input validation
- Secure payment signature verification
- HTTPS-ready

## 📧 Email Templates

### OTP Email
- Clean, professional design
- 6-digit OTP display
- 5-minute expiry notice
- Branded header

### Payment Receipt
- Transaction details
- Payment ID and Order ID
- Amount and status
- Professional formatting

## 🎯 Key Improvements Made

1. **Enhanced UI/UX**
   - Modern gradient designs
   - Smooth animations
   - Better color schemes
   - Improved typography
   - Responsive layouts

2. **Better Error Handling**
   - Snackbar notifications
   - Form validation
   - API error messages
   - Loading states

3. **Code Quality**
   - Lazy initialization for env variables
   - Proper error boundaries
   - Clean component structure
   - Reusable utilities

4. **Features Added**
   - Live clock on dashboard
   - Quick fee selection
   - Mobile navigation
   - Statistics cards
   - Quick actions panel

## 📝 Environment Variables

### Required Variables
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `EMAIL_HOST_USER` - Gmail address
- `EMAIL_HOST_PASSWORD` - Gmail app password

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB Atlas is accessible

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set API base URL environment variable

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Developer

Built with ❤️ using modern web technologies

## 🐛 Known Issues

None currently. If you find any bugs, please report them!

## 🔮 Future Enhancements

- [ ] Payment history page
- [ ] Download receipt as PDF
- [ ] Multiple payment methods
- [ ] Admin dashboard
- [ ] Analytics and reports
- [ ] Email templates customization
- [ ] Multi-language support
- [ ] Dark mode

## 📞 Support

For issues or questions, please check the documentation or create an issue in the repository.

---

**Happy Coding! 🎉**

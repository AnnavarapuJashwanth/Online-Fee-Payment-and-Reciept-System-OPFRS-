# 🔐 Production Deployment Credentials
**⚠️ NEVER COMMIT THIS FILE TO GITHUB - KEEP IT PRIVATE!**

## AWS Account Details
- **Account ID**: 693104802054
- **Region**: ap-south-1 (Mumbai)
- **Access Key**: AKIA2CYCD7EDGR4FEFW7
- **IAM User**: jashwanth_admin

## MongoDB Atlas Database
- **Cluster**: cluster0.kslri.mongodb.net
- **Database Name**: students
- **Username**: jashwanth
- **Password**: `92399239`
- **Full Connection String**:
  ```
  mongodb+srv://jashwanth:92399239@cluster0.kslri.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0
  ```
- **IP Whitelist**: 0.0.0.0/0 (All IPs - configured for cloud deployment)

## Backend (AWS Elastic Beanstalk)
- **Application Name**: ofprs
- **Environment**: ofprs-production
- **Platform**: Node.js 20 on Amazon Linux 2023
- **URL**: http://ofprs-production.eba-jhxevv9p.ap-south-1.elasticbeanstalk.com
- **Status**: ✅ Running

### Backend Environment Variables (Set via EB)
```bash
MONGO_URI=mongodb+srv://jashwanth:92399239@cluster0.kslri.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_2024_OPFRS_secure
PORT=8080
RAZORPAY_KEY_ID=rzp_test_Rc8QRJUPRiu73d
RAZORPAY_KEY_SECRET=eObTgZ6sWVrjvuiDUokKMG5w
EMAIL_HOST_USER=jashwanthannavarapu99@gmail.com
EMAIL_HOST_PASSWORD=gdct gtny qcae mzrd
SMTP_USER=jashwanthannavarapu99@gmail.com
SMTP_PASS=gdct gtny qcae mzrd
```

## Frontend (AWS S3)
- **Bucket Name**: ofprs-frontend-20251223
- **Region**: ap-south-1
- **URL**: http://ofprs-frontend-20251223.s3-website.ap-south-1.amazonaws.com
- **Hosting Type**: Static Website Hosting
- **Status**: ✅ Live

## Razorpay Payment Gateway
- **Mode**: Test Mode
- **Key ID**: rzp_test_Rc8QRJUPRiu73d
- **Key Secret**: eObTgZ6sWVrjvuiDUokKMG5w
- **Webhook Secret**: (Set in Razorpay dashboard)

## Email Service (Gmail SMTP)
- **Email**: jashwanthannavarapu99@gmail.com
- **App Password**: gdct gtny qcae mzrd
- **SMTP Host**: smtp.gmail.com
- **SMTP Port**: 587
- **TLS**: Enabled

## GitHub Repository
- **URL**: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-
- **Branch**: main
- **Last Commit**: CORS fixes for AWS deployment

## Deployment Commands

### Backend Deployment
```bash
cd e:\stackhack\backend
eb deploy
eb status
eb health
eb logs
```

### Frontend Deployment
```bash
cd e:\stackhack\frontend\onlinefee
npm run build
aws s3 sync dist/ s3://ofprs-frontend-20251223/ --delete --cache-control "max-age=3600"
```

### Update Environment Variables
```bash
cd e:\stackhack\backend
eb setenv MONGO_URI="your_mongo_uri" JWT_SECRET="your_jwt_secret"
```

## Security Notes
1. ✅ MongoDB password changed from 42974297 to 92399239 (after GitHub leak)
2. ✅ All credentials removed from GitHub repository
3. ✅ Using environment variables in AWS (not .env files)
4. ✅ S3 bucket has public read access (required for website hosting)
5. ✅ CORS configured for mobile and web access
6. ⚠️ Razorpay in TEST mode - switch to LIVE mode for production payments

## Mobile Access
- ✅ Backend allows CORS from any origin (for mobile apps)
- ✅ No authentication required for OPTIONS requests
- ✅ MongoDB accessible from any IP (0.0.0.0/0)
- ✅ Works on all devices (phone, tablet, desktop)

## Backup & Monitoring
- MongoDB Atlas: Automatic backups enabled
- AWS CloudWatch: Logs available in Elastic Beanstalk console
- Frontend: Files backed up in GitHub + S3 versioning
- Database: Export regularly from MongoDB Atlas dashboard

---
**Last Updated**: December 23, 2025
**Status**: ✅ Both Frontend and Backend Deployed Successfully

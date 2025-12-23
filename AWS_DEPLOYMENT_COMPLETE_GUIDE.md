# 🚀 Complete AWS Deployment Guide for OFPRS

## Overview
This guide will help you deploy your Online Fee Payment and Receipt System on AWS.

**Tech Stack:**
- Frontend: Vite + React
- Backend: Node.js + Express
- Database: MongoDB Atlas (Cloud)
- Repository: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-

---

## 📦 PART 1: Deploy Backend on AWS Elastic Beanstalk

### Prerequisites
1. AWS Account (already have - visible in your screenshot)
2. AWS CLI installed
3. Git installed

### Step 1: Install AWS CLI & EB CLI

**Install AWS CLI:**
```powershell
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use chocolatey:
choco install awscli
```

**Install Elastic Beanstalk CLI:**
```powershell
pip install awsebcli --upgrade --user
```

### Step 2: Configure AWS CLI

```powershell
aws configure
```

Enter your AWS credentials:
- AWS Access Key ID: [Get from AWS Console → Security Credentials]
- AWS Secret Access Key: [Get from AWS Console → Security Credentials]
- Default region: ap-south-2 (Hyderabad - as per your screenshot)
- Default output format: json

### Step 3: Prepare Backend for Deployment

✅ Already done! I've created:
- `.ebignore` - Tells EB what files to ignore
- `.npmrc` - npm configuration
- `Procfile` - Tells AWS how to start your app
- Updated `package.json` with Node.js version

### Step 4: Create Elastic Beanstalk Application

Navigate to backend directory:
```powershell
cd e:\stackhack\backend
```

Initialize Elastic Beanstalk:
```powershell
eb init
```

Follow the prompts:
1. Select region: **10) ap-south-2** (Hyderabad)
2. Application name: **ofprs-backend** (or your choice)
3. Platform: **Node.js**
4. Platform version: **Node.js 18 running on 64bit Amazon Linux 2023**
5. SSH: **Yes** (recommended for debugging)
6. Select keypair or create new one

### Step 5: Create Environment and Deploy

Create environment:
```powershell
eb create ofprs-production
```

This will:
- Create an EC2 instance
- Set up load balancer
- Configure security groups
- Deploy your application
- Give you a URL like: `ofprs-production.ap-south-2.elasticbeanstalk.com`

### Step 6: Set Environment Variables

Add your environment variables:
```powershell
eb setenv MONGO_URI="your-mongodb-connection-string" ^
JWT_SECRET="your-jwt-secret" ^
RAZORPAY_KEY_ID="your-razorpay-key" ^
RAZORPAY_KEY_SECRET="your-razorpay-secret" ^
EMAIL_HOST_USER="your-email" ^
EMAIL_HOST_PASSWORD="your-email-password" ^
SMTP_USER="your-smtp-user" ^
SMTP_PASS="your-smtp-password" ^
NODE_ENV="production" ^
PORT="8080"
```

**Note:** AWS Elastic Beanstalk uses port 8080 by default.

### Step 7: Open Your Backend

```powershell
eb open
```

Your backend will be accessible at: `http://ofprs-production.ap-south-2.elasticbeanstalk.com`

---

## 🎨 PART 2: Deploy Frontend on AWS Amplify

### Method 1: Using AWS Amplify Console (Easiest)

#### Step 1: Build Configuration

First, create an `amplify.yml` file in your frontend folder:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend/onlinefee
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/onlinefee/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/onlinefee/node_modules/**/*
```

#### Step 2: Update Frontend API URL

Before deploying, update your frontend to use the backend URL:
- Go to your frontend environment configuration
- Replace `http://localhost:5000` with your Elastic Beanstalk URL

#### Step 3: Deploy Using AWS Amplify Console

1. Go to **AWS Amplify Console**: https://console.aws.amazon.com/amplify/
2. Click **"New app"** → **"Host web app"**
3. Select **GitHub**
4. Authorize AWS Amplify to access your GitHub
5. Select repository: `Online-Fee-Payment-and-Reciept-System-OPFRS-`
6. Select branch: `main` (or your default branch)
7. Configure build settings:
   - App name: `ofprs-frontend`
   - Environment: `production`
   - Build settings: Use the auto-detected settings or paste the amplify.yml content
8. Click **"Save and deploy"**

Amplify will:
- Build your React app
- Deploy to CDN
- Provide HTTPS URL automatically
- Auto-deploy on every git push

Your frontend will be live at: `https://main.xxxxxx.amplifyapp.com`

---

## 🔧 PART 3: Configure CORS & Update URLs

### Update Backend CORS

Make sure your backend allows requests from your Amplify URL. The backend already has CORS configured, but verify the origin is set correctly.

### Update Frontend API Base URL

In your frontend code, update the API base URL to point to your Elastic Beanstalk backend.

Look for files like:
- `src/config.js`
- `src/services/api.js`
- Or anywhere `http://localhost:5000` is used

Replace with: `http://ofprs-production.ap-south-2.elasticbeanstalk.com`

---

## 📋 PART 4: Alternative - Deploy Frontend on S3 + CloudFront

If you prefer more control:

### Step 1: Build Frontend

```powershell
cd e:\stackhack\frontend\onlinefee
npm run build
```

This creates a `dist` folder with static files.

### Step 2: Create S3 Bucket

```powershell
aws s3 mb s3://ofprs-frontend-bucket --region ap-south-2
```

### Step 3: Enable Static Website Hosting

```powershell
aws s3 website s3://ofprs-frontend-bucket --index-document index.html --error-document index.html
```

### Step 4: Upload Files

```powershell
aws s3 sync dist/ s3://ofprs-frontend-bucket --acl public-read
```

### Step 5: Create CloudFront Distribution

1. Go to **CloudFront Console**
2. Click **"Create Distribution"**
3. Origin: Your S3 bucket
4. Default root object: `index.html`
5. Enable HTTPS
6. Create distribution

You'll get a CloudFront URL: `https://d111111abcdef8.cloudfront.net`

---

## 🔒 PART 5: Security & Domain Setup

### Option A: Use Custom Domain

1. Buy domain from Route 53 or external provider
2. In Route 53, create hosted zone
3. Add A record pointing to:
   - CloudFront distribution (frontend)
   - Elastic Beanstalk (backend)

### Option B: Use AWS URLs

Use the provided URLs:
- Backend: `http://ofprs-production.ap-south-2.elasticbeanstalk.com`
- Frontend: `https://main.xxxxxx.amplifyapp.com`

---

## 📊 PART 6: Monitoring & Maintenance

### View Logs

**Backend logs:**
```powershell
eb logs
```

**Or in AWS Console:**
- Go to Elastic Beanstalk → Your application → Logs

**Frontend logs:**
- AWS Amplify Console → Your app → Build history

### Update Backend

```powershell
cd e:\stackhack\backend
git add .
git commit -m "Update backend"
git push
eb deploy
```

### Update Frontend

Just push to GitHub - Amplify auto-deploys:
```powershell
cd e:\stackhack\frontend
git add .
git commit -m "Update frontend"
git push
```

---

## 💰 Cost Estimation

**Free Tier Eligible:**
- Elastic Beanstalk (Free tier: 750 hours/month for 12 months)
- S3 (5GB storage, 20,000 GET requests)
- CloudFront (1TB data transfer out for 12 months)
- AWS Amplify (1000 build minutes/month, 15GB served/month)

**After Free Tier:**
- EC2 t3.micro: ~$8-10/month
- S3: ~$0.023/GB/month
- CloudFront: ~$0.085/GB
- Amplify: ~$0.01/build minute

---

## 🚨 Common Issues & Solutions

### Issue 1: Backend not starting
**Solution:** Check environment variables are set correctly:
```powershell
eb printenv
```

### Issue 2: CORS errors
**Solution:** Ensure backend CORS allows your frontend domain

### Issue 3: MongoDB connection fails
**Solution:** 
- Whitelist AWS IP ranges in MongoDB Atlas
- Or use `0.0.0.0/0` for testing (not recommended for production)

### Issue 4: Frontend shows blank page
**Solution:** 
- Check if API URLs are updated
- Check browser console for errors
- Verify build completed successfully

---

## ✅ Quick Deployment Checklist

### Before Deployment:
- [ ] MongoDB Atlas is accessible (whitelist IPs)
- [ ] All environment variables noted down
- [ ] Code pushed to GitHub
- [ ] AWS account is active
- [ ] AWS CLI configured

### Backend Deployment:
- [ ] `eb init` completed
- [ ] `eb create` completed
- [ ] Environment variables set with `eb setenv`
- [ ] Backend is accessible at EB URL
- [ ] API endpoints tested

### Frontend Deployment:
- [ ] API URL updated in frontend code
- [ ] Amplify connected to GitHub
- [ ] Build successful
- [ ] Frontend is accessible
- [ ] Can connect to backend

---

## 📞 Support Commands

**Check backend status:**
```powershell
eb status
```

**View backend environment:**
```powershell
eb printenv
```

**SSH into backend server:**
```powershell
eb ssh
```

**View real-time logs:**
```powershell
eb logs --stream
```

---

## 🎯 Next Steps After Deployment

1. **Add Custom Domain** (Optional)
   - Buy domain from Route 53
   - Configure SSL certificate
   - Update DNS records

2. **Set up CI/CD** (Optional)
   - Backend: Use AWS CodePipeline
   - Frontend: Already set with Amplify auto-deploy

3. **Enable CloudWatch Monitoring**
   - Set up alarms for high CPU, memory
   - Monitor API response times

4. **Set up Backup Strategy**
   - Enable automated MongoDB Atlas backups
   - S3 versioning for static files

5. **Security Hardening**
   - Enable AWS WAF
   - Set up security groups
   - Regular security audits

---

## 🔗 Useful Links

- AWS Elastic Beanstalk Docs: https://docs.aws.amazon.com/elasticbeanstalk/
- AWS Amplify Docs: https://docs.amplify.aws/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Your Repository: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-

---

**Need help? Check AWS documentation or contact AWS Support!**

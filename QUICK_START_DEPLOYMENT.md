# 🎯 QUICK START - AWS Deployment in 5 Minutes

## Your Project Details
- **GitHub Repo**: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-
- **Frontend**: Vite + React (at `frontend/onlinefee/`)
- **Backend**: Node.js + Express (at `backend/`)
- **Database**: MongoDB Cloud (Already hosted ✅)
- **AWS Region**: Asia Pacific (Hyderabad) - ap-south-2

---

## 🚀 FASTEST WAY TO DEPLOY (3 Simple Steps)

### STEP 1: Deploy Backend (5 minutes)

```powershell
# 1. Install EB CLI
pip install awsebcli --upgrade --user

# 2. Configure AWS (if not done)
aws configure
# Enter your Access Key, Secret Key, region: ap-south-2

# 3. Go to backend folder
cd e:\stackhack\backend

# 4. Initialize and deploy
eb init
# Choose: 
# - Region: ap-south-2 (Hyderabad)
# - Platform: Node.js
# - Application name: ofprs-backend

# 5. Create and deploy
eb create ofprs-production

# 6. Set environment variables
eb setenv MONGO_URI="your-mongo-uri" JWT_SECRET="your-secret" RAZORPAY_KEY_ID="your-key" RAZORPAY_KEY_SECRET="your-secret" EMAIL_HOST_USER="your-email" EMAIL_HOST_PASSWORD="your-password" SMTP_USER="your-smtp" SMTP_PASS="your-pass" PORT="8080"

# 7. Open your backend
eb open
```

**Backend is LIVE! 🎉** at `http://ofprs-production.ap-south-2.elasticbeanstalk.com`

---

### STEP 2: Deploy Frontend (3 clicks!)

#### Using AWS Amplify Console:

1. **Open Amplify Console**: https://ap-south-2.console.aws.amazon.com/amplify/

2. **Click "New app"** → **"Host web app"**

3. **Connect GitHub**:
   - Authorize AWS Amplify
   - Select repo: `Online-Fee-Payment-and-Reciept-System-OPFRS-`
   - Branch: `main`

4. **Build settings** (auto-detected from `amplify.yml`):
   ```yaml
   Root directory: /
   Build command: cd frontend/onlinefee && npm run build
   Output directory: frontend/onlinefee/dist
   ```

5. **Click "Save and deploy"**

**Frontend is LIVE! 🎉** at `https://main.xxxxx.amplifyapp.com`

---

### STEP 3: Connect Frontend to Backend

Update API URL in your frontend code:

Find these files and replace `localhost:5000` with your Elastic Beanstalk URL:
- Any API configuration file
- axios base URL
- fetch calls

Example:
```javascript
// Before:
const API_URL = 'http://localhost:5000';

// After:
const API_URL = 'http://ofprs-production.ap-south-2.elasticbeanstalk.com';
```

Then commit and push - Amplify will auto-redeploy! 🚀

---

## 📋 Pre-Deployment Checklist

### 1. AWS Account Setup
- [ ] AWS Account active (You have this ✅)
- [ ] Get AWS Access Keys:
  - Go to: https://console.aws.amazon.com/iam/
  - Click your name → Security credentials
  - Create access key → CLI
  - Save Access Key ID and Secret Access Key

### 2. MongoDB Atlas
- [ ] Get connection string from MongoDB Atlas
- [ ] Whitelist AWS IP: `0.0.0.0/0` (or specific IPs)
  - MongoDB Atlas → Network Access → Add IP

### 3. Environment Variables Ready
- [ ] MONGO_URI
- [ ] JWT_SECRET
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] EMAIL credentials

---

## 💡 Helpful Commands

### Backend Commands:
```powershell
# View backend status
eb status

# View logs
eb logs

# SSH into server
eb ssh

# Update backend
git push
eb deploy

# View environment variables
eb printenv

# Restart server
eb restart
```

### Frontend Commands:
```powershell
# Just push to GitHub - Amplify auto-deploys!
git add .
git commit -m "Update frontend"
git push
```

---

## 🎬 What Happens After Deployment?

### Backend:
✅ Runs on AWS EC2 instance
✅ Auto-scaling enabled
✅ Load balancer configured
✅ Health monitoring active
✅ Accessible at: `http://[your-app].ap-south-2.elasticbeanstalk.com`

### Frontend:
✅ Deployed to global CDN
✅ HTTPS enabled automatically
✅ Auto-deploy on git push
✅ Fast worldwide access
✅ Accessible at: `https://[your-app].amplifyapp.com`

---

## ⚡ Alternative: Use My Helper Script

I've created a PowerShell script to help you:

```powershell
cd e:\stackhack
.\deploy-aws.ps1
```

This will:
- Check if AWS CLI is installed
- Check if EB CLI is installed
- Guide you through deployment
- Provide helpful commands

---

## 💰 Cost (Free Tier)

For first 12 months with AWS Free Tier:
- **Elastic Beanstalk**: FREE (750 hours/month)
- **EC2 t3.micro**: FREE (750 hours/month)
- **Amplify**: 1000 build minutes FREE
- **S3**: 5GB storage FREE
- **Data Transfer**: 15GB/month FREE

**Estimated cost after free tier**: $5-10/month

---

## 🆘 Need Help?

### Issue: EB CLI not found
```powershell
pip install awsebcli --upgrade --user
# Then restart PowerShell
```

### Issue: AWS credentials not configured
```powershell
aws configure
# Enter your credentials
```

### Issue: MongoDB connection failed
- Go to MongoDB Atlas → Network Access
- Add IP address: `0.0.0.0/0` (allows all)

### Issue: Backend not starting
```powershell
eb logs
# Check what went wrong
```

### Issue: CORS errors
- Update backend CORS to allow your Amplify URL
- Or use wildcard: `origin: '*'` (for testing only)

---

## 📚 Documentation

**Full detailed guide**: [AWS_DEPLOYMENT_COMPLETE_GUIDE.md](./AWS_DEPLOYMENT_COMPLETE_GUIDE.md)

**Your Repository**: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-

**AWS Documentation**:
- Elastic Beanstalk: https://docs.aws.amazon.com/elasticbeanstalk/
- Amplify: https://docs.amplify.aws/

---

## ✅ Deployment Success Checklist

After deployment, verify:
- [ ] Backend is accessible (open EB URL)
- [ ] Backend API endpoints work (test /api/health or similar)
- [ ] Frontend is accessible (open Amplify URL)
- [ ] Frontend can connect to backend (check browser console)
- [ ] MongoDB connection works
- [ ] Login/Registration works
- [ ] Payment gateway works
- [ ] Email sending works

---

**Ready to deploy? Run the helper script or follow STEP 1 above! 🚀**

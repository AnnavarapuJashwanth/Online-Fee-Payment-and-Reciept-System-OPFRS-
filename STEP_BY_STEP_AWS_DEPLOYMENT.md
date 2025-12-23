# 🎯 Step-by-Step AWS Deployment Guide
## Option 1: AWS Amplify + Elastic Beanstalk (Easiest Method)

---

## 📋 BEFORE YOU START

### What You Need:
1. ✅ AWS Account (you have this)
2. ✅ GitHub repository with your code (you have this)
3. ✅ MongoDB Atlas connection string
4. ✅ All environment variables (Razorpay keys, email credentials, etc.)

### Time Required: 30-45 minutes

---

## 🔧 PART 1: SETUP AWS CLI (One-time setup)

### Step 1.1: Install AWS CLI

**Download and Install:**
1. Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Download the installer
3. Run the installer (click Next → Next → Install)
4. Restart your PowerShell

**Verify Installation:**
```powershell
aws --version
```
You should see something like: `aws-cli/2.x.x Python/3.x.x Windows/10`

---

### Step 1.2: Get AWS Access Keys

1. **Login to AWS Console**: https://console.aws.amazon.com/

2. **Click your account name** (top-right corner) → **Security credentials**

3. **Scroll down to "Access keys"** section

4. **Click "Create access key"**
   - Choose: **"Command Line Interface (CLI)"**
   - Check the confirmation box
   - Click **"Next"**
   - Add description: "CLI for OFPRS deployment"
   - Click **"Create access key"**

5. **IMPORTANT**: Copy and save both:
   - **Access Key ID** (looks like: AKIAIOSFODNN7EXAMPLE)
   - **Secret Access Key** (looks like: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)
   
   ⚠️ You won't be able to see the Secret Key again!

---

### Step 1.3: Configure AWS CLI

```powershell
aws configure
```

**Enter the following when prompted:**

```
AWS Access Key ID [None]: <paste your Access Key ID>
AWS Secret Access Key [None]: <paste your Secret Access Key>
Default region name [None]: ap-south-2
Default output format [None]: json
```

**Verify Configuration:**
```powershell
aws sts get-caller-identity
```

You should see your AWS account details.

---

### Step 1.4: Install Elastic Beanstalk CLI

```powershell
pip install awsebcli --upgrade --user
```

**If you don't have pip, install Python first:**
- Download: https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

**Restart PowerShell** after installation

**Verify EB CLI:**
```powershell
eb --version
```

---

## 🚀 PART 2: DEPLOY BACKEND (Elastic Beanstalk)

### Step 2.1: Navigate to Backend Folder

```powershell
cd e:\stackhack\backend
```

---

### Step 2.2: Initialize Elastic Beanstalk

```powershell
eb init
```

**Follow the interactive prompts:**

**Prompt 1: Select a default region**
```
Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
...
10) ap-south-2 : Asia Pacific (Hyderabad)
...
(default is 3): 10
```
Type: **10** (for Hyderabad)

**Prompt 2: Application name**
```
Enter Application Name
(default is "backend"): ofprs-backend
```
Type: **ofprs-backend** (or press Enter for default)

**Prompt 3: Platform**
```
Select a platform
1) .NET Core on Linux
2) Docker
3) Go
4) Java
5) Node.js
6) PHP
...
(make a selection): 5
```
Type: **5** (for Node.js)

**Prompt 4: Platform branch**
```
Select a platform branch
1) Node.js 22 running on 64bit Amazon Linux 2023
2) Node.js 20 running on 64bit Amazon Linux 2023
3) Node.js 18 running on 64bit Amazon Linux 2023
(default is 1): 3
```
Type: **3** (Node.js 18 - compatible with your project)

**Prompt 5: CodeCommit**
```
Do you wish to continue with CodeCommit? (Y/n): n
```
Type: **n** (we're using GitHub)

**Prompt 6: SSH**
```
Do you want to set up SSH for your instances?
(Y/n): Y
```
Type: **Y** (recommended for debugging)

**Prompt 7: Keypair**
```
Select a keypair.
1) [ Create new KeyPair ]
(default is 1): 1
```
Type: **1** (Create new keypair)

**Enter keypair name:**
```
Type a keypair name.
(Default is aws-eb): ofprs-backend-key
```
Type: **ofprs-backend-key**

✅ **EB initialization complete!** You'll see a `.elasticbeanstalk` folder created.

---

### Step 2.3: Create Environment and Deploy

```powershell
eb create ofprs-production
```

**What happens now:**
- AWS creates an EC2 instance for you
- Installs Node.js
- Uploads your backend code
- Installs npm packages
- Starts your server
- Creates a load balancer
- Configures security groups

**This takes 5-10 minutes.** You'll see progress messages:

```
Creating application version archive "app-xxx".
Uploading ofprs-backend/app-xxx.zip to S3...
Environment creation in progress...
```

✅ **When complete**, you'll see:
```
Successfully launched environment: ofprs-production
```

---

### Step 2.4: Set Environment Variables

**Important:** Your app needs environment variables to work!

```powershell
eb setenv MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/dbname" JWT_SECRET="your-jwt-secret-key" RAZORPAY_KEY_ID="rzp_test_yourkey" RAZORPAY_KEY_SECRET="your-razorpay-secret" EMAIL_HOST_USER="your-email@gmail.com" EMAIL_HOST_PASSWORD="your-email-password" SMTP_USER="your-email@gmail.com" SMTP_PASS="your-smtp-password" NODE_ENV="production" PORT="8080"
```

**Replace with YOUR actual values:**
- `MONGO_URI` - Get from MongoDB Atlas
- `JWT_SECRET` - Your secret key from `.env`
- `RAZORPAY_KEY_ID` - From Razorpay dashboard
- `RAZORPAY_KEY_SECRET` - From Razorpay dashboard
- `EMAIL_HOST_USER` - Your Gmail
- `EMAIL_HOST_PASSWORD` - Gmail app password
- `SMTP_USER` - Same as email
- `SMTP_PASS` - Same as email password

**After setting env vars, restart:**
```powershell
eb restart
```

---

### Step 2.5: Get Backend URL

```powershell
eb status
```

Look for **"CNAME:"** - this is your backend URL!

Example: `ofprs-production.ap-south-2.elasticbeanstalk.com`

**Test your backend:**
```powershell
eb open
```

This opens your backend URL in browser. You should see your API!

---

### Step 2.6: View Logs (If Something Goes Wrong)

```powershell
eb logs
```

Or for real-time logs:
```powershell
eb logs --stream
```

---

## 🎨 PART 3: DEPLOY FRONTEND (AWS Amplify)

### Step 3.1: Update Frontend API URL

**BEFORE deploying frontend**, update the API URL:

1. **Find your API configuration file** (usually in `frontend/onlinefee/src/`)
   - Look for files like: `config.js`, `api.js`, `constants.js`
   - Or search for `localhost:5000` in your frontend code

2. **Replace localhost with your EB URL:**

```javascript
// Before:
const API_URL = 'http://localhost:5000';

// After:
const API_URL = 'http://ofprs-production.ap-south-2.elasticbeanstalk.com';
```

3. **Commit and push to GitHub:**
```powershell
cd e:\stackhack
git add .
git commit -m "Update API URL for production"
git push
```

---

### Step 3.2: Open AWS Amplify Console

1. **Go to AWS Amplify**: https://ap-south-2.console.aws.amazon.com/amplify/home?region=ap-south-2

2. **Click "Create new app"** (big orange button)

---

### Step 3.3: Connect to GitHub

1. **Select "GitHub"** as source

2. **Click "Continue"**

3. **Authorize AWS Amplify**
   - Click "Authorize aws-amplify-console"
   - Enter your GitHub password if prompted
   - Click "Authorize"

4. **You'll be redirected back to AWS Amplify**

---

### Step 3.4: Select Repository

1. **Select your repository:**
   - Repository: **Online-Fee-Payment-and-Reciept-System-OPFRS-**
   - Branch: **main** (or **master**, depending on your default branch)

2. **Click "Next"**

---

### Step 3.5: Configure Build Settings

**App name:**
```
ofprs-frontend
```

**Amplify will auto-detect your build settings from `amplify.yml`**

Your build settings should look like:
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

**If auto-detection doesn't work:**
1. Click "Edit" on build settings
2. Paste the above YAML
3. Click "Save"

**Click "Next"**

---

### Step 3.6: Review and Deploy

1. **Review all settings**
   - App name: ofprs-frontend
   - Branch: main
   - Build settings: Configured

2. **Click "Save and deploy"**

---

### Step 3.7: Wait for Deployment

**AWS Amplify will now:**
1. ✅ Clone your repository
2. ✅ Install dependencies (`npm ci`)
3. ✅ Build your React app (`npm run build`)
4. ✅ Deploy to global CDN
5. ✅ Enable HTTPS automatically

**This takes 3-5 minutes.**

You'll see four stages:
- 🟡 Provision (30s)
- 🟡 Build (2-3 min)
- 🟡 Deploy (1 min)
- 🟢 Verify (30s)

---

### Step 3.8: Get Frontend URL

**When deployment succeeds**, you'll see:

```
✅ Deployment successfully completed
```

**Your frontend URL** will be shown at the top:
```
https://main.dxxxxxxxxxxxxx.amplifyapp.com
```

**Click on it** to open your website!

---

## ✅ PART 4: VERIFY EVERYTHING WORKS

### Step 4.1: Test Backend

1. **Open backend URL:**
   ```
   http://ofprs-production.ap-south-2.elasticbeanstalk.com
   ```

2. **Test an API endpoint:**
   ```
   http://ofprs-production.ap-south-2.elasticbeanstalk.com/api/auth/test
   ```
   (or whatever endpoint you have)

---

### Step 4.2: Test Frontend

1. **Open frontend URL:**
   ```
   https://main.dxxxxxxxxxxxxx.amplifyapp.com
   ```

2. **Check browser console** (Press F12):
   - No CORS errors
   - API calls working

3. **Test functionality:**
   - ✅ Login/Register
   - ✅ Dashboard loads
   - ✅ Payment works
   - ✅ Data saves

---

### Step 4.3: Fix CORS (If Needed)

**If you see CORS errors in browser console:**

1. **Edit backend CORS settings** (in `server.js`):

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://main.dxxxxxxxxxxxxx.amplifyapp.com'  // Add your Amplify URL
  ],
  credentials: true
}));
```

2. **Deploy backend again:**
```powershell
cd e:\stackhack\backend
eb deploy
```

---

## 🎉 PART 5: YOUR DEPLOYMENT IS COMPLETE!

### Your Live URLs:
- **Frontend**: `https://main.dxxxxxxxxxxxxx.amplifyapp.com`
- **Backend**: `http://ofprs-production.ap-south-2.elasticbeanstalk.com`

---

## 📊 PART 6: MANAGING YOUR DEPLOYMENT

### Update Backend:

```powershell
cd e:\stackhack\backend
# Make your changes
git add .
git commit -m "Update backend"
git push
eb deploy  # Deploy to AWS
```

### Update Frontend:

```powershell
cd e:\stackhack\frontend
# Make your changes
git add .
git commit -m "Update frontend"
git push  # Amplify auto-deploys!
```

**That's it!** Amplify watches your GitHub repo and auto-deploys on every push.

---

### View Backend Logs:

```powershell
cd e:\stackhack\backend
eb logs
```

### View Frontend Logs:

1. Go to **Amplify Console**
2. Click your app
3. Click on the build
4. See logs for each stage

---

### Monitor Backend Health:

```powershell
eb health
```

Or go to:
- **AWS Console** → **Elastic Beanstalk** → **ofprs-production**

---

### Monitor Frontend Performance:

- **Amplify Console** → **Your app** → **Monitoring**
- See traffic, errors, performance metrics

---

## 🆘 TROUBLESHOOTING

### Backend Issues:

**Problem: Backend not starting**
```powershell
eb logs
# Check what's wrong
```

Common issues:
- Missing environment variables → Run `eb setenv` again
- MongoDB connection failed → Check MongoDB Atlas whitelist
- Port issue → Make sure PORT=8080

**Problem: 502 Bad Gateway**
- Backend crashed
- Check logs: `eb logs`
- Restart: `eb restart`

---

### Frontend Issues:

**Problem: Blank page**
- Check browser console (F12)
- Check if API URL is correct
- Check Amplify build logs

**Problem: CORS errors**
- Add Amplify URL to backend CORS
- Redeploy backend: `eb deploy`

**Problem: Build fails on Amplify**
- Check build logs in Amplify console
- Verify `amplify.yml` paths are correct
- Make sure `package.json` has all dependencies

---

## 💰 COST ESTIMATE

**AWS Free Tier (First 12 months):**
- Elastic Beanstalk: FREE
- EC2 t3.micro: 750 hours/month FREE
- Amplify: 1000 build minutes FREE, 15GB served FREE
- Load Balancer: Small cost (~$16/month)

**After Free Tier:**
- ~$20-30/month for small traffic

**To reduce costs:**
- Use t3.micro or t3.nano instance
- Stop environment when not in use: `eb terminate`

---

## 🎯 QUICK REFERENCE COMMANDS

### Backend (Elastic Beanstalk):
```powershell
cd e:\stackhack\backend

eb status          # Check status
eb health          # Check health
eb logs            # View logs
eb logs --stream   # Real-time logs
eb deploy          # Deploy updates
eb restart         # Restart server
eb open            # Open in browser
eb ssh             # SSH into server
eb terminate       # Delete environment
```

### Frontend (Amplify):
```powershell
# Just push to GitHub:
git add .
git commit -m "Update"
git push

# Amplify auto-deploys!
```

---

## ✅ DEPLOYMENT CHECKLIST

### Before Deployment:
- [x] AWS CLI installed
- [x] EB CLI installed
- [x] AWS configured (`aws configure`)
- [x] MongoDB Atlas accessible
- [x] All environment variables ready
- [x] Code pushed to GitHub

### Backend Deployment:
- [ ] `eb init` completed
- [ ] `eb create` completed
- [ ] Environment variables set (`eb setenv`)
- [ ] Backend URL working
- [ ] API endpoints tested

### Frontend Deployment:
- [ ] API URL updated in frontend code
- [ ] Changes pushed to GitHub
- [ ] Amplify connected to GitHub
- [ ] Build successful
- [ ] Frontend URL working
- [ ] Can connect to backend

### Final Checks:
- [ ] Login/Register works
- [ ] Dashboard loads
- [ ] Payments work
- [ ] Email notifications work
- [ ] No console errors

---

## 🎊 CONGRATULATIONS!

Your Online Fee Payment System is now live on AWS! 🚀

**Share your URLs:**
- Frontend: `https://main.dxxxxxxxxxxxxx.amplifyapp.com`
- Backend: `http://ofprs-production.ap-south-2.elasticbeanstalk.com`

**Need help?** Check:
- AWS Elastic Beanstalk docs: https://docs.aws.amazon.com/elasticbeanstalk/
- AWS Amplify docs: https://docs.amplify.aws/

---

**Happy Deploying! 🎉**

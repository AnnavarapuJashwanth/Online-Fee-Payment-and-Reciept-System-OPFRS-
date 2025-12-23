# Quick AWS Deployment Script

Write-Host "🚀 OFPRS AWS Deployment Helper" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if AWS CLI is installed
Write-Host "1️⃣ Checking AWS CLI..." -ForegroundColor Yellow
if (Get-Command aws -ErrorAction SilentlyContinue) {
    Write-Host "✅ AWS CLI is installed" -ForegroundColor Green
    aws --version
} else {
    Write-Host "❌ AWS CLI not found. Please install from: https://awscli.amazonaws.com/AWSCLIV2.msi" -ForegroundColor Red
    exit
}

# Check if EB CLI is installed
Write-Host "`n2️⃣ Checking Elastic Beanstalk CLI..." -ForegroundColor Yellow
if (Get-Command eb -ErrorAction SilentlyContinue) {
    Write-Host "✅ EB CLI is installed" -ForegroundColor Green
    eb --version
} else {
    Write-Host "❌ EB CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host "Run: pip install awsebcli --upgrade --user" -ForegroundColor Cyan
    $install = Read-Host "Do you want to install it now? (y/n)"
    if ($install -eq 'y') {
        pip install awsebcli --upgrade --user
    } else {
        Write-Host "Please install EB CLI manually" -ForegroundColor Red
        exit
    }
}

# Check AWS credentials
Write-Host "`n3️⃣ Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AWS credentials are configured" -ForegroundColor Green
        Write-Host $identity
    } else {
        throw "Not configured"
    }
} catch {
    Write-Host "❌ AWS credentials not configured" -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Cyan
    $configure = Read-Host "Do you want to configure now? (y/n)"
    if ($configure -eq 'y') {
        aws configure
    } else {
        exit
    }
}

Write-Host "`n4️⃣ Deployment Options:" -ForegroundColor Yellow
Write-Host "1. Deploy Backend to Elastic Beanstalk"
Write-Host "2. Deploy Frontend to Amplify (Manual - via Console)"
Write-Host "3. Build Frontend for S3 deployment"
Write-Host "4. View deployment guide"
Write-Host "5. Exit"

$choice = Read-Host "`nEnter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🔧 Deploying Backend..." -ForegroundColor Cyan
        Set-Location -Path "e:\stackhack\backend"
        
        # Check if EB is initialized
        if (Test-Path ".elasticbeanstalk") {
            Write-Host "EB already initialized. Deploying..." -ForegroundColor Green
            eb deploy
        } else {
            Write-Host "Initializing Elastic Beanstalk..." -ForegroundColor Yellow
            eb init
            Write-Host "`nCreating environment..." -ForegroundColor Yellow
            eb create ofprs-production
        }
        
        Write-Host "`n✅ Backend deployment initiated!" -ForegroundColor Green
        Write-Host "View status: eb status" -ForegroundColor Cyan
        Write-Host "Set env vars: eb setenv MONGO_URI=your-uri JWT_SECRET=your-secret ..." -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host "`n🎨 Frontend Deployment Instructions:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://console.aws.amazon.com/amplify/" -ForegroundColor Yellow
        Write-Host "2. Click 'New app' → 'Host web app'" -ForegroundColor Yellow
        Write-Host "3. Connect to GitHub repository:" -ForegroundColor Yellow
        Write-Host "   https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-" -ForegroundColor Cyan
        Write-Host "4. Select branch (main/master)" -ForegroundColor Yellow
        Write-Host "5. Amplify will auto-detect settings from amplify.yml" -ForegroundColor Yellow
        Write-Host "6. Click 'Save and deploy'" -ForegroundColor Yellow
        Write-Host "`n✅ The amplify.yml file is already created in your project root!" -ForegroundColor Green
    }
    
    "3" {
        Write-Host "`n🏗️ Building Frontend..." -ForegroundColor Cyan
        Set-Location -Path "e:\stackhack\frontend\onlinefee"
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Frontend built successfully!" -ForegroundColor Green
            Write-Host "Build output is in: frontend/onlinefee/dist" -ForegroundColor Cyan
            Write-Host "`nTo deploy to S3:" -ForegroundColor Yellow
            Write-Host "1. Create S3 bucket: aws s3 mb s3://ofprs-frontend --region ap-south-2" -ForegroundColor Cyan
            Write-Host "2. Upload files: aws s3 sync dist/ s3://ofprs-frontend --acl public-read" -ForegroundColor Cyan
            Write-Host "3. Enable static hosting: aws s3 website s3://ofprs-frontend --index-document index.html" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host "`n📖 Opening deployment guide..." -ForegroundColor Cyan
        Start-Process "e:\stackhack\AWS_DEPLOYMENT_COMPLETE_GUIDE.md"
    }
    
    "5" {
        Write-Host "`n👋 Goodbye!" -ForegroundColor Cyan
        exit
    }
    
    default {
        Write-Host "`n❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host "`n📚 For detailed guide, see: AWS_DEPLOYMENT_COMPLETE_GUIDE.md" -ForegroundColor Green
Write-Host "🔗 Your repo: https://github.com/AnnavarapuJashwanth/Online-Fee-Payment-and-Reciept-System-OPFRS-`n" -ForegroundColor Cyan

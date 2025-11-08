# OFPRS - Deployment Guide

## 🚀 Production Deployment

### **Option 1: Deploy to Vercel (Frontend) + Render (Backend)**

#### **Frontend Deployment (Vercel):**

1. **Prepare Frontend:**
```bash
cd frontend/onlinefee
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

3. **Environment Variables in Vercel:**
- Go to Vercel Dashboard
- Select your project
- Settings → Environment Variables
- Add:
  - `VITE_API_URL=your_backend_url`

#### **Backend Deployment (Render):**

1. **Create `render.yaml`:**
```yaml
services:
  - type: web
    name: ofprs-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
```

2. **Deploy:**
- Push code to GitHub
- Connect Render to GitHub
- Add environment variables
- Deploy

---

### **Option 2: Deploy to Heroku**

#### **Backend:**

1. **Create Heroku App:**
```bash
heroku create ofprs-backend
```

2. **Set Environment Variables:**
```bash
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set RAZORPAY_KEY_ID=your_key
heroku config:set RAZORPAY_KEY_SECRET=your_secret
```

3. **Deploy:**
```bash
git push heroku main
```

#### **Frontend:**

1. **Update API URL:**
```javascript
// In frontend, update API_URL
const API_URL = "https://ofprs-backend.herokuapp.com/api";
```

2. **Build and Deploy:**
```bash
npm run build
# Deploy dist folder to Netlify/Vercel
```

---

### **Option 3: Deploy to AWS**

#### **Backend (EC2):**

1. **Launch EC2 Instance:**
- Ubuntu 22.04 LTS
- t2.micro (free tier)
- Configure security groups (ports 80, 443, 5000)

2. **Setup Server:**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd ofprs/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add environment variables

# Start with PM2
pm2 start server.js --name ofprs-backend
pm2 startup
pm2 save
```

3. **Setup Nginx:**
```bash
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/ofprs

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ofprs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **Frontend (S3 + CloudFront):**

1. **Build Frontend:**
```bash
cd frontend/onlinefee
npm run build
```

2. **Upload to S3:**
- Create S3 bucket
- Enable static website hosting
- Upload dist folder
- Set bucket policy for public access

3. **Setup CloudFront:**
- Create CloudFront distribution
- Point to S3 bucket
- Configure SSL certificate
- Set custom domain

---

### **Option 4: Docker Deployment**

#### **Create Dockerfiles:**

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### **Docker Compose:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    depends_on:
      - mongo

  frontend:
    build: ./frontend/onlinefee
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

#### **Deploy:**
```bash
docker-compose up -d
```

---

## 🔒 **Security Checklist**

### **Before Production:**

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS policy
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test payment gateway
- [ ] Review error handling
- [ ] Check file upload limits
- [ ] Secure environment variables
- [ ] Enable logging
- [ ] Set up alerts

---

## 🌐 **Domain Setup**

### **1. Purchase Domain:**
- GoDaddy, Namecheap, or Google Domains
- Example: ofprs.edu or yourcollegename.edu

### **2. Configure DNS:**

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Custom Server:**
```
Type: A
Name: @
Value: your-server-ip

Type: CNAME
Name: www
Value: your-domain.com
```

### **3. SSL Certificate:**
- Use Let's Encrypt (free)
- Or use platform SSL (Vercel, Netlify)

```bash
# For Nginx with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 📊 **Monitoring & Analytics**

### **Setup Monitoring:**

1. **Backend Monitoring:**
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. **Error Tracking:**
- Sentry.io
- LogRocket
- Rollbar

3. **Performance Monitoring:**
- New Relic
- DataDog
- Google Analytics

---

## 💾 **Database Backup**

### **MongoDB Atlas (Recommended):**
- Automatic backups enabled
- Point-in-time recovery
- Download backups manually

### **Manual Backup:**
```bash
# Backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ofprs"

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/ofprs" dump/
```

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy OFPRS

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend/onlinefee
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 **Mobile App (Future)**

### **React Native:**
```bash
# Initialize
npx react-native init OFPRSMobile

# Use existing API
# Reuse components
# Add mobile-specific features
```

### **PWA (Progressive Web App):**
```javascript
// Add to vite.config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'OFPRS',
        short_name: 'OFPRS',
        description: 'Online Fee Payment System',
        theme_color: '#667eea',
      }
    })
  ]
}
```

---

## 🧪 **Testing Before Deployment**

### **Backend Tests:**
```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

### **Frontend Tests:**
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Run tests
npm test
```

### **Load Testing:**
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test
ab -n 1000 -c 10 http://your-api-url/api/announcements
```

---

## 📈 **Scaling**

### **Horizontal Scaling:**
- Use load balancer (Nginx, AWS ELB)
- Multiple backend instances
- Redis for session management
- CDN for static assets

### **Vertical Scaling:**
- Upgrade server resources
- Optimize database queries
- Enable caching
- Compress responses

---

## 🎯 **Post-Deployment Checklist**

- [ ] All pages accessible
- [ ] Payment gateway working
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Database connected
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Error tracking active
- [ ] Analytics configured
- [ ] Performance optimized
- [ ] Security headers set
- [ ] CORS configured
- [ ] Rate limiting enabled

---

## 📞 **Support After Deployment**

### **Maintenance:**
- Regular updates
- Security patches
- Database optimization
- Log monitoring
- Performance tuning

### **User Support:**
- Help documentation
- Video tutorials
- FAQ section
- Support tickets
- Email support

---

## 💡 **Tips for College Project**

### **For Presentation:**
1. Deploy to free tier services
2. Use custom domain (optional)
3. Prepare demo account
4. Test all features
5. Have backup plan

### **Free Hosting Options:**
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Render, Railway, Fly.io
- **Database:** MongoDB Atlas (free tier)

### **Cost Estimate:**
- **Free Tier:** $0/month
- **Basic:** $5-10/month
- **Production:** $20-50/month

---

**Your OFPRS is ready for deployment!** 🚀

Choose the deployment option that best fits your needs and follow the steps above. Good luck with your college project! 🎓

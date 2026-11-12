# 🚀 Black & Brown Coffee Shop — Deployment Guide

This guide covers deploying your coffee shop application to production.

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] Change admin password from default (`admin123`)
- [ ] Set strong `JWT_SECRET` in production `.env`
- [ ] Replace Chapa test key with live key (`CHASECK-...`)
- [ ] Configure email notifications (Gmail App Password)
- [ ] Set up Telegram bot for order alerts (optional)
- [ ] Review and update branding information
- [ ] Test all features locally first
- [ ] Backup your local database

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend + DB)

**Best for:** Quick deployment, automatic scaling

#### Backend + Database (Render or Railway)

1. **Create PostgreSQL Database**
   - Sign up at [Render.com](https://render.com) or [Railway.app](https://railway.app)
   - Create a new PostgreSQL database
   - Copy the connection string (format: `postgresql://user:pass@host:port/dbname`)

2. **Deploy Backend**
   ```bash
   # In your project root
   cd server
   
   # Create render.yaml or railway.json (see templates below)
   ```

3. **Set Environment Variables** on Render/Railway dashboard:
   ```env
   PG_HOST=your-db-host
   PG_PORT=5432
   PG_DATABASE=your-db-name
   PG_USER=your-db-user
   PG_PASSWORD=your-db-password
   
   JWT_SECRET=your-production-secret-min-32-chars
   
   CHAPA_SECRET_KEY=CHASECK-your-live-key
   FRONTEND_URL=https://your-vercel-app.vercel.app
   SERVER_URL=https://your-backend.onrender.com
   
   # Optional
   MAIL_SERVICE=gmail
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   
   TELEGRAM_BOT_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id
   ```

4. **Initialize Database**
   - Connect to your database via CLI or GUI
   - Run setup scripts:
   ```bash
   # On Render, use their Shell feature
   node scripts/setupDb.js
   node scripts/setupBrandDb.js
   node scripts/seedAdmin.js
   node scripts/seedProducts.js
   node scripts/seedMenu.js
   ```

#### Frontend (Vercel)

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Your GitHub Repository**
   - Click "New Project"
   - Import from GitHub
   - Select `Black-And-Brown-Coffee-Shop`

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. **Deploy!**
   - Vercel will auto-deploy on every push to `main`

---

### Option 2: Single Server (VPS - DigitalOcean/AWS/Linode)

**Best for:** Full control, cost-effective for high traffic

#### 1. Provision Server

- Ubuntu 22.04 LTS (recommended)
- Minimum: 2GB RAM, 1 CPU, 50GB disk
- Open ports: 80 (HTTP), 443 (HTTPS), 22 (SSH)

#### 2. Install Dependencies

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

#### 3. Set Up PostgreSQL

```bash
sudo -u postgres psql

# Inside psql:
CREATE DATABASE coffeedb;
CREATE USER coffeeuser WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE coffeedb TO coffeeuser;
\q
```

#### 4. Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/Black-And-Brown-Coffee-Shop.git
cd Black-And-Brown-Coffee-Shop

# Set up backend
cd server
npm install --production
cp .env.example .env
nano .env  # Edit with your production values

# Initialize database
node scripts/setupDb.js
node scripts/setupBrandDb.js
node scripts/seedAdmin.js
node scripts/seedProducts.js
node scripts/seedMenu.js

# Start backend with PM2
pm2 start index.js --name coffee-backend
pm2 save
pm2 startup  # Follow the instructions

# Build frontend
cd ../client
npm install
npm run build
```

#### 5. Configure Nginx

```bash
nano /etc/nginx/sites-available/coffeeshop
```

Paste this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/Black-And-Brown-Coffee-Shop/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/coffeeshop /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### 6. Set Up SSL (HTTPS)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Follow the prompts. Certbot will auto-renew certificates.

---

## 🔐 Security Hardening

### 1. Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. PostgreSQL Security

```bash
nano /etc/postgresql/14/main/pg_hba.conf
```

Change:
```
# "local" is for Unix domain socket connections only
local   all             all                                     md5
```

Restart PostgreSQL:
```bash
systemctl restart postgresql
```

### 3. Environment Variables

Never commit `.env` files! Use:
- Vercel/Render: Dashboard environment variables
- VPS: Store in `/etc/environment` or use PM2 ecosystem file

### 4. Rate Limiting

Already implemented in `app.js`:
- 100 requests per 15 minutes (general)
- 20 requests per 15 minutes (auth endpoints)

---

## 📊 Monitoring & Maintenance

### Server Logs (PM2)

```bash
pm2 logs coffee-backend
pm2 monit
```

### Database Backup

```bash
# Daily backup cron job
crontab -e

# Add this line (runs at 2 AM daily)
0 2 * * * pg_dump -U coffeeuser coffeedb > /backups/coffeedb_$(date +\%Y\%m\%d).sql
```

### Update Application

```bash
cd /var/www/Black-And-Brown-Coffee-Shop
git pull origin main

# Update backend
cd server
npm install --production
pm2 restart coffee-backend

# Update frontend
cd ../client
npm install
npm run build
```

---

## 🌍 Domain & DNS Setup

1. **Purchase a domain** (Namecheap, GoDaddy, Cloudflare)

2. **Add DNS records:**
   ```
   A    @              <your-server-ip>
   A    www            <your-server-ip>
   A    api            <your-server-ip>
   ```

3. **Wait for propagation** (5 minutes - 48 hours)

4. **Test:** Visit `http://yourdomain.com`

---

## 🔧 Troubleshooting

### Backend won't start
```bash
pm2 logs coffee-backend --lines 100
# Check for:
# - Database connection errors (wrong credentials)
# - Missing environment variables
# - Port already in use
```

### Frontend shows blank page
```bash
# Check browser console (F12)
# Common issues:
# - VITE_API_URL pointing to wrong backend
# - CORS errors (check FRONTEND_URL in backend .env)
```

### Database connection errors
```bash
# Test connection
psql -h localhost -U coffeeuser -d coffeedb

# Check PostgreSQL is running
systemctl status postgresql
```

### Chapa payment not working
- Verify you're using **live** key (`CHASECK-...` not `CHASECK_TEST-...`)
- Check webhook URL is publicly accessible
- Verify callback URL is set correctly in Chapa dashboard

---

## 📱 Post-Deployment

### 1. Change Admin Password
- Log in with `admin@coffeeshop.com` / `admin123`
- Go to Profile → Change Password

### 2. Test Full Order Flow
- Browse products
- Add to cart
- Place test order (Cash on Delivery)
- Check order appears in admin dashboard
- Update order status
- Verify email is sent

### 3. Set Up Telegram Alerts (Optional)
- Follow README.md Telegram Setup section
- Test by placing an order
- Verify alert is received

### 4. Update Branding
- Admin Dashboard → Branding tab
- Update shop name, contact info, delivery fees
- Save changes

### 5. Monitor First Week
- Check PM2 logs daily
- Monitor server resources
- Test payment gateway
- Collect customer feedback

---

## 🎉 You're Live!

Your coffee shop is now published and accepting orders. Share your URL!

**Need help?** Open an issue on GitHub or contact support.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Chapa API Documentation](https://chapa.co/docs)

---

**Last updated:** November 2026

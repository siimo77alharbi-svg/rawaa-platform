# 🚀 دليل نشر منصة رواء

هذا الدليل يوضح كيفية نشر منصة رواء على خادم إنتاج.

## 📋 المتطلبات

1. **خادم Linux** (Ubuntu 20.04 أو أحدث)
   - معالج: 2 vCPU على الأقل
   - ذاكرة: 4GB RAM على الأقل
   - تخزين: 50GB SSD
2. **دومين مسجل** (.sa أو أي نطاق آخر)
3. **وصول SSH** إلى الخادم

## 🏗️ خيارات النشر

### الخيار 1: النشر التلقائي (موصى به)

استخدم سكربت النشر التلقائي:

```bash
# على جهازك المحلي
scp scripts/deploy.sh user@your-server-ip:~
ssh user@your-server-ip
chmod +x deploy.sh
sudo ./deploy.sh
```

### الخيار 2: النشر اليدوي

اتبع الخطوات أدناه خطوة بخطوة.

## 🔧 خطوات النشر اليدوي

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# تثبيت Redis
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# تثبيت Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# تثبيت PM2
sudo npm install -g pm2
```

### 2. إعداد قاعدة البيانات

```bash
sudo -u postgres createdb rawaa
sudo -u postgres createuser -P rawaa_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE rawaa TO rawaa_user;"
```

### 3. نقل المشروع إلى الخادم

```bash
# على الخادم
mkdir -p /var/www/rawaa
cd /var/www/rawaa

# استنساخ من GitHub
git clone https://github.com/siimo77alharbi-svg/rawaa-platform.git .
```

### 4. إعداد ملفات التكوين

```bash
cp .env.example .env

# تعديل .env ببياناتك الحقيقية
nano .env
```

متغيرات البيئة المطلوبة:
- `DATABASE_URL` - رابط قاعدة البيانات
- `JWT_SECRET` - مفتاح سري للمصادقة
- `TAMARA_API_KEY`, `TABBY_API_KEY` - مفاتيح الدفع
- `SMS_API_KEY` - مفتاح خدمة الرسائل النصية

### 5. تثبيت الحزم وبناء التطبيق

```bash
npm ci --production
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build
```

### 6. إعداد SSL

```bash
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d rawaa.sa -d www.rawaa.sa
```

### 7. إعداد Nginx

انسخ ملف `nginx.conf` إلى الخادم:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/rawaa
sudo ln -sf /etc/nginx/sites-available/rawaa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. تشغيل التطبيق

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 9. إعداد النسخ الاحتياطي والمراقبة

```bash
./scripts/setup-backup-cron.sh
./scripts/setup-monitoring-cron.sh
```

## ✅ التحقق من النشر

بعد اكتمال النشر، تحقق من:

- [ ] الموقع يعمل: https://rawaa.sa
- [ ] API يعمل: https://rawaa.sa/api/health
- [ ] SSL certificate مثبت
- [ ] النسخ الاحتياطي مجدول
- [ ] المراقبة تعمل

## 📊 مراقبة التطبيق

```bash
# عرض سجلات التطبيق
pm2 logs

# عرض حالة العمليات
pm2 list

# إعادة تشغيل التطبيق
pm2 restart all
```

## 🔄 تحديث التطبيق

```bash
cd /var/www/rawaa
git pull origin main
npm install
npx prisma db push
npm run build
pm2 restart all
```

أو استخدم سكربت النشر السريع:

```bash
./scripts/quick-deploy.sh
```

## 🆘 استكشاف الأخطاء

### التطبيق لا يعمل
```bash
pm2 logs rawaa-api
pm2 logs rawaa-frontend
```

### مشكلة في قاعدة البيانات
```bash
sudo systemctl status postgresql
sudo -u postgres psql -l
```

### مشكلة في SSL
```bash
sudo certbot renew --dry-run
openssl s_client -connect rawaa.sa:443 -servername rawaa.sa
```

## 📞 الدعم

للمساعدة الفنية، تواصل معنا أو افتح issue على GitHub.
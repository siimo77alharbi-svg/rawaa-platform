# منصة رواء الصحية

منصة رقمية متكاملة لإدارة المنتجعات الصحية واللياقة البدنية في المملكة العربية السعودية.

## 🚀 المميزات

### نظام الحجز
- حجز مواعيد عبر الإنترنت
- إدارة الجدولة
- تذكيرات تلقائية

### نظام المدفوعات
- بوابات دفع متعددة (مدى، فيزا، ماستركارد، Apple Pay، STC Pay)
- تقسيط (تمارا، تابي)
- فواتير إلكترونية
- نظام نقاط الولاء والعضويات

### الإشعارات
- رسائل SMS تلقائية
- إشعارات Email
- إشعارات Push
- قوالب رسائل قابلة للتخصيص

### التحليلات والتقارير
- لوحة تحكم شاملة
- تقارير الإيرادات
- تحليلات الحجوزات
- مؤشرات الأداء (KPIs)

### نقطة البيع (POS)
- بيع المنتجات والخدمات
- إدارة المخزون
- فواتير نقطية

### توصيات الذكاء الاصطناعي
- مقترحات مخصصة للعملاء
- مساعد ذكي
- تحليل السلوك الشرائي

## 🛠️ التقنيات المستخدمة

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** JWT, OAuth
- **Payments:** Stripe API, Saudi Payment Gateways
- **SMS:** Unifonic / Twilio

## 📋 البدء

```bash
# Clone the repository
git clone https://github.com/siimo77alharbi-svg/rawaa-platform.git

# Install dependencies
cd rawaa-platform
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

افتح http://localhost:3000 في المتصفح.

## 📦 الباقات

### الباقة الأساسية - 500 ريال/شهر
- 3 جلسات تدليك شهرياً
- استخدام الحمام التركي
- خصم 10% على المنتجات

### الباقة الذهبية - 1200 ريال/شهر
- 8 جلسات تدليك شهرياً
- استخدام الحمام التركي والسونا
- خصم 15% على المنتجات
- أولوية الحجز

### الباقة VIP - 2500 ريال/شهر
- جلسات غير محدودة
- جميع المرافق مفتوحة
- خصم 20% على المنتجات
- مدير حساب خاص
- أولوية الحجز المضمونة

## 📞 التواصل

- الموقع: https://rawaa-wellness.sa
- البريد: info@rawaa-wellness.sa
- الهاتف: +966 11 123 4567

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 منصة رواء الصحية.
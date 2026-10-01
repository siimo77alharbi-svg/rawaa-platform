import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'مدير النظام',
      email: 'admin@rawaa.sa',
      phone: '+966500000001',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create therapist users
  const therapist1Password = await bcrypt.hash('therapist123', 10);
  const therapist1 = await prisma.user.create({
    data: {
      name: 'سارة أحمد',
      email: 'sara@rawaa.sa',
      phone: '+966500000002',
      password: therapist1Password,
      role: 'THERAPIST',
    },
  });

  const therapist2Password = await bcrypt.hash('therapist123', 10);
  const therapist2 = await prisma.user.create({
    data: {
      name: 'محمد علي',
      email: 'mohammed@rawaa.sa',
      phone: '+966500000003',
      password: therapist2Password,
      role: 'THERAPIST',
    },
  });

  // Create receptionist
  const receptionPassword = await bcrypt.hash('reception123', 10);
  const receptionist = await prisma.user.create({
    data: {
      name: 'نورة خالد',
      email: 'noura@rawaa.sa',
      phone: '+966500000004',
      password: receptionPassword,
      role: 'RECEPTIONIST',
    },
  });

  console.log('✅ Created staff users');

  // Create services
  const services = [
    {
      name: 'جلسة مساج علاجي',
      description: 'جلسة مساج متخصصة لتخفيف الآلام العضلية والتوتر',
      category: 'مساج',
      duration: 60,
      price: 300,
    },
    {
      name: 'جلسة أوميجا',
      description: 'جلسة استرخاء وتجديد حيوية',
      category: 'استرخاء',
      duration: 45,
      price: 200,
    },
    {
      name: 'جلسة تدليك رياضي',
      description: 'تدليك رياضي احترافي بعد التمارين',
      category: 'رياضي',
      duration: 90,
      price: 400,
    },
    {
      name: 'جلسة حار',
      description: 'جلسة تدليك بالحرارة مع زيوت عطرية',
      category: 'مساج',
      duration: 60,
      price: 350,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log('✅ Created services');

  // Create sample products for POS
  const products = [
    { name: 'زيت عطري - لافندر', price: 50, stock: 50, category: 'زيوت' },
    { name: 'كريم مرطب', price: 80, stock: 30, category: 'كريمات' },
    { name: 'منشفة فاخرة', price: 120, stock: 20, category: 'إكسسوارات' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Created products');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
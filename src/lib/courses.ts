// نظام الدورات والبرامج الصحية

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// إنشاء دورة تعليمية جديدة
export async function createCourse(data: any) {
  return prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      duration: data.duration,
      category: data.category,
      level: data.level,
      price: data.price,
      instructor: data.instructor,
      schedule: data.schedule,
      maxParticipants: data.maxParticipants,
      status: 'active'
    }
  });
}

// حجز مقعد في دورة
export async function enrollInCourse(customerId: number, courseId: number) {
  const enrollment = await prisma.courseEnrollment.create({
    data: {
      customerId,
      courseId,
      enrollmentDate: new Date(),
      status: 'enrolled'
    }
  });

  // خصم نقاط الولاء أو الخصومات
  await prisma.loyaltyTransaction.create({
    data: {
      customerId,
      type: 'spend',
      points: 10,
      description: 'حجز في دورة تعليمية'
    }
  });

  // إرسال إشعار
  await prisma.notification.create({
    data: {
      customerId,
      channel: 'email',
      type: 'course_enrollment',
      content: JSON.stringify({ courseId, courseName: null }),
      status: 'sent'
    }
  });

  return enrollment;
}

// الحصول على التوصيات الشخصية للدورات
export async function getCourseRecommendations(customerId: number) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      healthProfile: true,
      bookings: { include: { service: true } }
    }
  });

  if (!customer) return [];

  // تحليل التفضيلات الصحية
  const interests = [];

  if (customer.healthProfile) {
    if (customer.healthProfile.stressLevel >= 60) interests.push('stress');
    if (customer.healthProfile.sleepQuality < 60) interests.push('sleep');
    if (customer.healthProfile.energyLevel < 60) interests.push('energy');
  }

  // تحليل الخدمات المحجوزة
  const serviceCategories = customer.bookings.map(b => b.service?.category).filter(Boolean);
  if (serviceCategories.includes('المساج')) interests.push('massage');
  if (serviceCategories.includes('العلاج الحراري')) interests.push('thermal');

  // البحث عن دورات مطابقة
  const recommendedCourses = await prisma.course.findMany({
    where: {
      status: 'active',
      OR: [
        { tags: { has: 'stress' } },
        { tags: { has: 'sleep' } },
        { tags: { has: 'energy' } }
      ]
    },
    take: 5
  });

  return recommendedCourses;
}

// إكمال دورة وتسجيل التقييم
export async function completeCourse(enrollmentId: number, rating: number, feedback: string) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId }
  });

  if (!enrollment) return null;

  await prisma.courseEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: 'completed',
      completionDate: new Date(),
      rating,
      feedback
    }
  });

  // منح نقاط الولاء
  await prisma.loyaltyTransaction.create({
    data: {
      customerId: enrollment.customerId,
      type: 'earn',
      points: 50,
      description: 'إكمال دورة تعليمية'
    }
  });

  return enrollment;
}

// الحصول على شهادة إتمام
export async function generateCertificate(enrollmentId: number) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { id: enrollmentId },
    include: { customer: true, course: true }
  });

  if (!enrollment) return null;

  const certificate = {
    id: `CERT-${enrollment.id}`,
    customerName: enrollment.customer?.fullName,
    courseName: enrollment.course?.title,
    completionDate: enrollment.completionDate,
    instructor: enrollment.course?.instructor,
    certificateUrl: `/certificates/${enrollment.id}.pdf`
  };

  return certificate;
}

// نظام الاختبارات الصحية الذكية
export async function administerHealthTest(customerId: number, questions: any[]) {
  const test = await prisma.healthTest.create({
    data: {
      customerId,
      questions: JSON.stringify(questions),
      date: new Date()
    }
  });

  return test;
}

export async function submitTestResults(testId: number, answers: any[]) {
  const test = await prisma.healthTest.findUnique({
    where: { id: testId },
    include: { customer: true }
  });

  if (!test) return null;

  // تحليل الإجابات
  const results = analyzeTestResults(answers);

  // تحديث الاختبار بالنتائج
  await prisma.healthTest.update({
    where: { id: testId },
    data: {
      answers: JSON.stringify(answers),
      results: JSON.stringify(results),
      status: 'completed'
    }
  });

  // تحديث الملف الصحي للعميل
  if (results.profileUpdate) {
    await prisma.customer.update({
      where: { id: test.customerId },
      data: {
        healthProfile: {
          ...test.customer.healthProfile,
          ...results.profileUpdate
        },
        healthAssessmentDate: new Date()
      }
    });
  }

  return results;
}

function analyzeTestResults(answers: any[]) {
  const results = {
    stressLevel: 0,
    sleepQuality: 0,
    skinCondition: 0,
    energyLevel: 0,
    recommendations: [],
    profileUpdate: null
  };

  // تحليل كل إجابة
  answers.forEach(answer => {
    if (answer.category === 'stress') {
      results.stressLevel += answer.value;
    } else if (answer.category === 'sleep') {
      results.sleepQuality += answer.value;
    } else if (answer.category === 'skin') {
      results.skinCondition += answer.value;
    } else if (answer.category === 'energy') {
      results.energyLevel += answer.value;
    }
  });

  // توليد التوصيات
  if (results.stressLevel > 50) {
    results.recommendations.push('جلسة تمارين التنفس');
  }
  if (results.sleepQuality < 40) {
    results.recommendations.push('علاج الزيوت العطرية');
  }

  return results;
}

module.exports = {
  createCourse,
  enrollInCourse,
  getCourseRecommendations,
  completeCourse,
  generateCertificate,
  administerHealthTest,
  submitTestResults
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// تحليل سلوك العملاء لتقديم توصيات مخصصة
export async function analyzeCustomerBehavior(customerId: number) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      bookings: { include: { service: true } },
      purchases: true,
      loyaltyHistory: true
    }
  });

  if (!customer) return null;

  // تحليل التفضيلات
  const serviceCategories = customer.bookings
    .map(b => b.service?.category)
    .filter(Boolean)
    .reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  // تحديد أكثر الخدمات طلباً
  const topCategory = Object.entries(serviceCategories)
    .sort((a, b) => b[1] - a[1])[0];

  // تحليل أنماط الحجز
  const bookingDates = customer.bookings.map(b => b.date);
  const avgInterval = calculateAverageInterval(bookingDates);

  // التوصيات
  const recommendations = [];

  if (topCategory) {
    recommendations.push({
      type: 'service',
      category: topCategory[0],
      reason: 'بناءً على تفضيلاتك السابقة'
    });
  }

  if (avgInterval && shouldRecommendVisit(avgInterval, bookingDates)) {
    recommendations.push({
      type: 'revisit',
      daysSinceLast: getDaysSinceLast(bookingDates),
      reason: 'حان وقت زيارتك التالية'
    });
  }

  // توصية بالاشتراكات
  if (customer.bookings.length >= 3 && !customer.isMember) {
    recommendations.push({
      type: 'membership',
      reason: 'يمكنك توفير حتى 30% مع الاشتراك'
    });
  }

  // توصية بالعلاجات التكميلية
  const complementaryServices = getComplementaryServices(topCategory?.[0]);
  if (complementaryServices) {
    recommendations.push({
      type: 'complementary',
      services: complementaryServices,
      reason: 'تكمّل علاجاتك الحالية'
    });
  }

  return {
    customerId,
    recommendations,
    topCategory: topCategory?.[0],
    avgVisitInterval: avgInterval
  };
}

// نظام التوصيات الذكية للخدمات
export async function getSmartRecommendations(customerId: number, context?: any) {
  const analysis = await analyzeCustomerBehavior(customerId);

  if (!analysis) return [];

  // تصفية وتخصيص التوصيات حسب السياق
  const filtered = analysis.recommendations.filter(rec => {
    if (context?.excludeTypes?.includes(rec.type)) return false;
    return true;
  });

  return filtered;
}

// التقييم الصحي الذكي
export async function generateHealthProfile(customerId: number, answers: any) {
  const profile = {
    customerId,
    assessmentDate: new Date(),
    stressLevel: evaluateStress(answers),
    sleepQuality: evaluateSleep(answers),
    skinCondition: evaluateSkin(answers),
    energyLevel: evaluateEnergy(answers),
    recommendations: []
  };

  // تحليل الإجابات وتوليد التوصيات
  if (profile.stressLevel >= 70) {
    profile.recommendations.push({
      service: 'جلسة تمارين التنفس واليوغا',
      reason: 'مستوى التوتر مرتفع'
    });
  }

  if (profile.sleepQuality < 50) {
    profile.recommendations.push({
      service: 'علاج الزيوت العطرية للنوم',
      reason: 'جودة النوم منخفضة'
    });
  }

  // حفظ الملف الصحي
  const saved = await prisma.customer.update({
    where: { id: customerId },
    data: {
      healthProfile: profile,
      healthAssessmentDate: new Date()
    }
  });

  return profile;
}

// خوارزمية تحديد السعر الديناميكي
export async function calculateDynamicPricing(serviceId: number, date: Date) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { bookings: true }
  });

  if (!service) return service?.price;

  // حساب عامل الطلب
  const demandFactor = calculateDemand(service, date);

  // السعر الديناميكي
  const dynamicPrice = service.price * demandFactor;

  return Math.round(dynamicPrice);
}

function calculateDemand(service: any, date: Date) {
  // حساب عدد الحجوزات في نفس الفترة
  const sameWeekBookings = service.bookings.filter(b =>
    isSameWeek(b.date, date)
  ).length;

  // عامل الطلب (1.0 = طبيعي، <1 = منخفض، >1 = مرتفع)
  if (sameWeekBookings < 5) return 0.9; // خصم في الأوقات الهادئة
  if (sameWeekBookings > 15) return 1.1; // زيادة في الأوقات مزدحمة
  return 1.0;
}

function evaluateStress(answers: any) {
  // تحليل إجابات الاستبيان لتحديد مستوى التوتر
  let score = 0;
  if (answers.feelTired) score += 20;
  if (answers.difficultySleeping) score += 25;
  if (answers.muscleTension) score += 20;
  if (answers.irritability) score += 15;
  if (answers.headaches) score += 20;
  return Math.min(100, score);
}

function evaluateSleep(answers: any) {
  let score = 100;
  if (answers.difficultySleeping) score -= 30;
  if (answers.wakeEarly) score -= 20;
  if (answers.notRefreshing) score -= 25;
  if (answers.sleepLessThan6h) score -= 25;
  return Math.max(0, score);
}

function evaluateSkin(answers: any) {
  let score = 100;
  if (answers.drySkin) score -= 20;
  if (answers.oilySkin) score -= 15;
  if (answers.acne) score -= 25;
  if (answers.sensitive) score -= 10;
  if (answers.darkSpots) score -= 20;
  return Math.max(0, score);
}

function evaluateEnergy(answers: any) {
  let score = 100;
  if (answers.lowEnergy) score -= 30;
  if (answers.fatigue) score -= 25;
  if (answers.brainFog) score -= 20;
  if (answers.lackMotivation) score -= 25;
  return Math.max(0, score);
}

function getComplementaryServices(category: string) {
  const mappings = {
    'المساج': ['العلاج الحراري', 'التقشير'],
    'العلاج الحراري': ['المساج', 'جلسة استرخاء'],
    'التقشير': ['العناية بالبشرة', 'العلاج بالأكسجين']
  };
  return mappings[category] || [];
}

function calculateAverageInterval(dates: Date[]) {
  if (dates.length < 2) return null;

  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];

  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i].getTime() - sorted[i-1].getTime()) / (1000 * 60 * 60 * 24);
    intervals.push(diff);
  }

  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return avg;
}

function shouldRecommendVisit(avgInterval: number, dates: Date[]) {
  const lastVisit = dates[dates.length - 1];
  const daysSince = (new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > avgInterval * 0.8;
}

function getDaysSinceLast(dates: Date[]) {
  const last = dates[dates.length - 1];
  return Math.floor((new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

function isSameWeek(date1: Date, date2: Date) {
  const week1 = getWeekNumber(date1);
  const week2 = getWeekNumber(date2);
  return week1 === week2;
}

function getWeekNumber(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + ((4 - d.getDay() + 7) % 7));
  return Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7);
}

// تصدير الدوال
module.exports = {
  analyzeCustomerBehavior,
  getSmartRecommendations,
  generateHealthProfile,
  calculateDynamicPricing
};
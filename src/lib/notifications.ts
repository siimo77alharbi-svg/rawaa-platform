import { prisma } from './prisma';

export type NotificationType = 'BOOKING_CONFIRMATION' | 'REMINDER' | 'PROMO' | 'GENERAL';

// Arabic notification templates
const templates = {
  BOOKING_CONFIRMATION: {
    sms: (name: string, service: string, date: string) =>
      `مرحباً ${name}، تم تأكيد حجزك لخدمة ${service} بتاريخ ${date}. نتمنى لك تجربة ممتعة في مركز رواء للWellness.`,
    emailSubject: 'تأكيد الحجز - رواء للWellness',
    emailBody: (name: string, service: string, date: string) =>
      `<h2>تأكيد الحجز</h2>
       <p>مرحباً ${name}،</p>
       <p>نود أن نؤكد لكم حجزك لخدمة <strong>${service}</strong> بتاريخ <strong>${date}</strong>.</p>
       <p>في حال أردت تعديل موعدك أو إلغاء الحجز، يرجى التواصل معنا.</p>
       <p>نتمنى لك تجربة ممتعة في مركز رواء للWellness.</p>`,
  },
  REMINDER: {
    sms: (name: string, service: string, date: string) =>
      `تذكير ${name}: لديك موعد غدًا لخدمة ${service} في ${date}. نراكم هناك!`,
    emailSubject: 'تذكير بموعدك - رواء للWellness',
    emailBody: (name: string, service: string, date: string) =>
      `<h2>تذكير بموعدك</h2>
       <p>مرحباً ${name}،</p>
       <p>هذا تذكير بأن لديك موعدًا غدًا لخدمة <strong>${service}</strong> في <strong>${date}</strong>.</p>
       <p>نراكم هناك!</p>`,
  },
  PROMO: {
    sms: (offer: string) => `عرض خاص من رواء! ${offer} استغل الفرصة الآن.`,
    emailSubject: 'عرض خاص من رواء للWellness',
    emailBody: (offer: string) =>
      `<h2>عرض خاص</h2>
       <p>عرض مميز من رواء للWellness:</p>
       <p><strong>${offer}</strong></p>
       <p>استغل الفرصة الآن!</p>`,
  },
  GENERAL: {
    sms: (message: string) => message,
    emailSubject: 'رسالة من رواء للWellness',
    emailBody: (message: string) =>
      `<h2>رسالة من رواء</h2>
       <p>${message}</p>`,
  },
};

// Mock SMS provider (since no API keys available)
async function sendSmsMock(phone: string, message: string): Promise<void> {
  console.log(`[SMS Mock] Sending to ${phone}: ${message}`);
  // In production, this would call an actual SMS provider API
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Mock Email provider
async function sendEmailMock(email: string, subject: string, body: string): Promise<void> {
  console.log(`[Email Mock] Sending to ${email}: ${subject}`);
  // In production, this would call an actual email provider API
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Send booking confirmation
export async function sendBookingConfirmation(
  userId: string,
  userName: string,
  userPhone?: string,
  userEmail?: string,
  serviceName: string,
  bookingDate: string
) {
  const results = { sms: null, email: null };

  if (userPhone) {
    const message = templates.BOOKING_CONFIRMATION.sms(userName, serviceName, bookingDate);
    await sendSmsMock(userPhone, message);

    results.sms = await prisma.smsLog.create({
      data: {
        userId,
        phone: userPhone,
        message,
        type: 'BOOKING_CONFIRMATION',
        status: 'SENT',
      },
    });
  }

  if (userEmail) {
    const subject = templates.BOOKING_CONFIRMATION.emailSubject;
    const body = templates.BOOKING_CONFIRMATION.emailBody(userName, serviceName, bookingDate);
    await sendEmailMock(userEmail, subject, body);

    results.email = await prisma.emailLog.create({
      data: {
        userId,
        email: userEmail,
        subject,
        body,
        type: 'BOOKING_CONFIRMATION',
        status: 'SENT',
      },
    });
  }

  return results;
}

// Send appointment reminder (24h before)
export async function sendAppointmentReminder(
  userId: string,
  userName: string,
  userPhone?: string,
  userEmail?: string,
  serviceName: string,
  bookingDate: string
) {
  const results = { sms: null, email: null };

  if (userPhone) {
    const message = templates.REMINDER.sms(userName, serviceName, bookingDate);
    await sendSmsMock(userPhone, message);

    results.sms = await prisma.smsLog.create({
      data: {
        userId,
        phone: userPhone,
        message,
        type: 'REMINDER',
        status: 'SENT',
      },
    });
  }

  if (userEmail) {
    const subject = templates.REMINDER.emailSubject;
    const body = templates.REMINDER.emailBody(userName, serviceName, bookingDate);
    await sendEmailMock(userEmail, subject, body);

    results.email = await prisma.emailLog.create({
      data: {
        userId,
        email: userEmail,
        subject,
        body,
        type: 'REMINDER',
        status: 'SENT',
      },
    });
  }

  return results;
}

// Send promo message
export async function sendPromoMessage(
  userId: string,
  userName: string,
  userPhone?: string,
  userEmail?: string,
  offer: string
) {
  const results = { sms: null, email: null };

  if (userPhone) {
    const message = templates.PROMO.sms(offer);
    await sendSmsMock(userPhone, message);

    results.sms = await prisma.smsLog.create({
      data: {
        userId,
        phone: userPhone,
        message,
        type: 'PROMO',
        status: 'SENT',
      },
    });
  }

  if (userEmail) {
    const subject = templates.PROMO.emailSubject;
    const body = templates.PROMO.emailBody(offer);
    await sendEmailMock(userEmail, subject, body);

    results.email = await prisma.emailLog.create({
      data: {
        userId,
        email: userEmail,
        subject,
        body,
        type: 'PROMO',
        status: 'SENT',
      },
    });
  }

  return results;
}

// Send general notification
export async function sendGeneralNotification(
  userId: string,
  userName: string,
  userPhone?: string,
  userEmail?: string,
  message: string
) {
  const results = { sms: null, email: null };

  if (userPhone) {
    await sendSmsMock(userPhone, message);

    results.sms = await prisma.smsLog.create({
      data: {
        userId,
        phone: userPhone,
        message,
        type: 'GENERAL',
        status: 'SENT',
      },
    });
  }

  if (userEmail) {
    const subject = templates.GENERAL.emailSubject;
    const body = templates.GENERAL.emailBody(message);
    await sendEmailMock(userEmail, subject, body);

    results.email = await prisma.emailLog.create({
      data: {
        userId,
        email: userEmail,
        subject,
        body,
        type: 'GENERAL',
        status: 'SENT',
      },
    });
  }

  return results;
}

// Get notification logs
export async function getNotificationLogs(limit: number = 50) {
  const [smsLogs, emailLogs] = await Promise.all([
    prisma.smsLog.findMany({
      take: limit,
      orderBy: { sentAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    }),
    prisma.emailLog.findMany({
      take: limit,
      orderBy: { sentAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    }),
  ]);

  return { smsLogs, emailLogs };
}
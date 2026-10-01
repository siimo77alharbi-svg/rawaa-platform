// Notification templates in Arabic

export const SMS_TEMPLATES = {
  BOOKING_CONFIRMATION: {
    body: (name: string, serviceName: string, date: string) =>
      `أهلاً ${name}، تم تأكيد حجزك لـ ${serviceName} بتاريخ ${date}. ننتظرك في منتجع رواء.`,
    type: "BOOKING_CONFIRMATION",
  },
  REMINDER: {
    body: (name: string, serviceName: string, date: string) =>
      `تذكير ${name}: لديك موعد ${serviceName} غداً ${date} في منتجع رواء.`,
    type: "REMINDER",
  },
  PROMO: {
    body: (offer: string) => `عرض خاص في منتجع رواء: ${offer}`,
    type: "PROMO",
  },
  GENERAL: {
    body: (message: string) => message,
    type: "GENERAL",
  },
};

export const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION: {
    subject: (serviceName: string) => `تأكيد الحجز - ${serviceName}`,
    body: (name: string, serviceName: string, date: string, time: string) => `
      <h2>أهلاً ${name}</h2>
      <p>تم تأكيد حجزك بنجاح</p>
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
        <p><strong>الخدمة:</strong> ${serviceName}</p>
        <p><strong>التاريخ:</strong> ${date}</p>
        <p><strong>الوقت:</strong> ${time}</p>
      </div>
      <p>ننتظرك في منتجع رواء الصحي.</p>
    `,
    type: "BOOKING_CONFIRMATION",
  },
  REMINDER: {
    subject: (serviceName: string) => `تذكير بموعدك - ${serviceName}`,
    body: (name: string, serviceName: string, date: string, time: string) => `
      <h2>تذكير ${name}</h2>
      <p>لديك موعد غداً:</p>
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:16px 0;">
        <p><strong>الخدمة:</strong> ${serviceName}</p>
        <p><strong>التاريخ:</strong> ${date}</p>
        <p><strong>الوقت:</strong> ${time}</p>
      </div>
      <p>منتجع رواء الصحي</p>
    `,
    type: "REMINDER",
  },
  PROMO: {
    subject: (offer: string) => `عرض خاص من رواء: ${offer}`,
    body: (offer: string) => `
      <h2>عرض خاص</h2>
      <p>${offer}</p>
      <p>منتجع رواء الصحي</p>
    `,
    type: "PROMO",
  },
  GENERAL: {
    subject: (subject: string) => subject,
    body: (body: string) => `<p>${body}</p>`,
    type: "GENERAL",
  },
};
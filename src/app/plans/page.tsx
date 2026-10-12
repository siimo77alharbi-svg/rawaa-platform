import React, { useState } from "react";
import Link from "next/link";

const plans = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: 500,
    period: "شهرياً",
    features: [
      "3 جلسات تدليك شهرياً",
      "استخدام الحمام التركي",
      "خصم 10% على المنتجات",
      "رسائل SMS تأكيدية",
    ],
    popular: false,
  },
  {
    id: "gold",
    name: "الباقة الذهبية",
    price: 1200,
    period: "شهرياً",
    features: [
      "8 جلسات تدليك شهرياً",
      "استخدام الحمام التركي والسونا",
      "خصم 15% على المنتجات",
      "رسائل SMS وEmail",
      "أولوية الحجز",
      "جلسة مجانية كل شهر",
    ],
    popular: true,
  },
  {
    id: "vip",
    name: "الباقة VIP",
    price: 2500,
    period: "شهرياً",
    features: [
      "جلسات غير محدودة",
      "جميع المرافق مفتوحة",
      "خصم 20% على المنتجات",
      "مدير حساب خاص",
      "أولوية الحجز المضمونة",
      "3 جلسات مجانية شهرياً",
      "دعوة للعروض الخاصة",
    ],
    popular: false,
  },
];

export default function PlansPage() {
  const [selected, setSelected] = useState("gold");

  return (
    <div className="flex flex-col flex-1 bg-surface">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">الباقات والاشتراكات</h1>
            <Link href="/dashboard" className="btn btn-outline text-sm">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">اختر الباقة المناسبة لك</h2>
          <p className="text-neutral-500">جميع الباقات تشمل إمكانية الإلغاء في أي وقت</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`card p-8 relative ${
                plan.popular ? "border-2 border-primary-500" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                  الأكثر طلباً
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">{plan.price}</span>
                <span className="text-neutral-400"> {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-primary-600">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelected(plan.id)}
                className={`btn w-full py-3 ${
                  selected === plan.id ? "btn-primary" : "btn-outline"
                }`}
              >
                اختر هذه الباقة
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
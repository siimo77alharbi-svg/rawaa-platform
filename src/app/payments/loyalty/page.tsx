import React, { useState } from "react";
import Link from "next/link";

const rewards = [
  { id: 1, points: 100, title: "خصم 10% على الجلسة القادمة", icon: "🎫" },
  { id: 2, points: 200, title: "جلسة مجانية (30 دقيقة)", icon: "🧖" },
  { id: 3, points: 500, title: "باقة 3 جلسات", icon: "📦" },
  { id: 4, points: 1000, title: "ترقية إلى الباقة الذهبية", icon: "👑" }
];

export default function LoyaltyPage() {
  const [points] = useState(350);

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">نقاط الولاء</h1>
        
        {/* Points Balance */}
        <div className="card p-8 mb-8 text-center bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="text-5xl font-bold text-primary-700 mb-2">{points}</div>
          <div className="text-lg text-primary-600">نقطة متاحة</div>
        </div>

        {/* Rewards */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">المكافآت المتاحة</h2>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <span className="font-medium text-foreground">{reward.title}</span>
                </div>
                <button
                  disabled={points < reward.points}
                  className="btn btn-primary px-4 py-2 text-sm disabled:opacity-50"
                >
                  {reward.points} نقاط
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

import React from "react";

export default function AIRecommendationsPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">توصيات الذكاء الاصطناعي</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Personalized Recommendations */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">🤖 مقترحات مخصصة لك</h2>
          <p className="text-neutral-500 mb-6">
            بناءً على سجل حجوزاتك وتفضيلاتك، يقترح الذكاء الاصطناعي هذه العلاجات:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationCard
              title="جلسة تدليك بالزيت الحار"
              reason="لأنك حجزت جلسات تدليك سابقة بشكل متكرر"
              price={400}
            />
            <RecommendationCard
              title="باقة العناية بالبشرة الكاملة"
              reason="بناءً على اهتمامك بمنتجات العناية بالبشرة"
              price={800}
            />
          </div>
        </div>

        {/* AI Chat Assistant */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">💬 مساعد رواء الذكي</h2>
          <p className="text-neutral-500 mb-4">اسأل أي سؤال عن خدماتنا أو احصل على توصيات مخصصة</p>
          <div className="p-4 bg-neutral-50 rounded-lg text-center text-neutral-400">
            🤖 المساعد الذكي جاهز للرد على استفساراتك
          </div>
        </div>
      </main>
    </div>
  );
}

function RecommendationCard({ title, reason, price }) {
  return (
    <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
      <h3 className="font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 mb-3">{reason}</p>
      <div className="flex items-center justify-between">
        <span className="text-primary-600 font-bold">{price} ريال</span>
        <button className="btn btn-primary text-sm px-4 py-2">احجز الآن</button>
      </div>
    </div>
  );
}
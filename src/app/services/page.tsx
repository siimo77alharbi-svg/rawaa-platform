"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ServicesPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      window.location.href = '/login';
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">الخدمات</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            title="جلسة مساج علاجي"
            duration="60 دقيقة"
            price="300 ريال"
            description="جلسة مساج متخصصة لتخفيف الآلام العضلية"
          />
          <ServiceCard
            title="جلسة أوميجا"
            duration="45 دقيقة"
            price="200 ريال"
            description="جلسة استرخاء وتجديد حيوية"
          />
          <ServiceCard
            title="جلسة تدليك رياضي"
            duration="90 دقيقة"
            price="400 ريال"
            description="تدليك رياضي احترافي بعد التمارين"
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ title, duration, price, description }: { title: string; duration: string; price: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 text-sm">⏱ {duration}</span>
        <span className="font-bold text-blue-600">{price}</span>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
        احجز الآن
      </button>
    </div>
  );
}
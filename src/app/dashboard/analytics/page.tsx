import React from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">التحليلات والتقارير</h1>
            <Link href="/dashboard" className="btn btn-outline text-sm">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard title="إجمالي الإيرادات" value="52,800" unit="ريال" trend="+15%" />
          <AnalyticsCard title="الحجوزات هذا الشهر" value="186" trend="+8%" />
          <AnalyticsCard title="العملاء الجدد" value="42" trend="+23%" />
          <AnalyticsCard title="معدل الرضا" value="94" unit="%" trend="+3%" />
        </div>

        {/* Charts Placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">إيرادات الشهر</h2>
            <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center">
              <span className="text-neutral-400">📊 الرسم البياني للإيرادات</span>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">الحجوزات اليومية</h2>
            <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center">
              <span className="text-neutral-400">📈 الرسم البياني للحجوزات</span>
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">الخدمات الأكثر طلباً</h2>
          <div className="space-y-4">
            <TopService name="جلسة التدليك العلاجي" bookings={48} revenue={16800} />
            <TopService name="باقة VIP" bookings={12} revenue={18000} />
            <TopService name="تقشير الجسم" bookings={35} revenue={17500} />
            <TopService name="جلسة استرخاء شاملة" bookings={22} revenue={17600} />
          </div>
        </div>
      </main>
    </div>
  );
}

function AnalyticsCard({ title, value, unit, trend }) {
  return (
    <div className="card p-6">
      <div className="text-sm text-neutral-500 mb-2">{title}</div>
      <div className="text-3xl font-bold text-foreground mb-2">
        {value}<span className="text-lg text-neutral-400">{unit}</span>
      </div>
      <div className="text-sm text-green-600 font-medium">{trend}</div>
    </div>
  );
}

function TopService({ name, bookings, revenue }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <div className="text-sm text-neutral-400">{bookings} حجز</div>
      </div>
      <div className="text-primary-600 font-bold">{revenue.toLocaleString()} ريال</div>
    </div>
  );
}
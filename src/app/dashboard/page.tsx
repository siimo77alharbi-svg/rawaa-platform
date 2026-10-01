"use client";
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    fetchStats();
    fetchBookings();
  }, [session]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">لوحة التحكم - رواء</h1>
          <button
            onClick={() => signOut()}
            className="text-gray-600 hover:text-gray-800"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="الحجوزات اليوم" value={stats?.bookingsToday || 0} color="blue" />
          <StatCard title="الحجوزات المعلقة" value={stats?.pendingBookings || 0} color="yellow" />
          <StatCard title="الاشتراكات النشطة" value={stats?.activeSubscriptions || 0} color="green" />
          <StatCard title="إجمالي المستخدمين" value={stats?.usersTotal || 0} color="purple" />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">آخر الحجوزات</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">العميل</th>
                <th className="text-left py-2">الخدمة</th>
                <th className="text-left py-2">التاريخ</th>
                <th className="text-left py-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="py-3">{booking.user?.name}</td>
                  <td className="py-3">{booking.service?.name}</td>
                  <td className="py-3">
                    {new Date(booking.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  const colors: any = {
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className={`rounded-lg p-6 ${colors[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'معلقة' },
    CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'مؤكدة' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتملة' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'ملغاة' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function BookingsPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">الحجوزات</h1>
          <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-800">
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/bookings/new"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 mb-6"
        >
          حجز جديد
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">قائمة الحجوزات</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">العميل</th>
                <th className="text-left py-2">الخدمة</th>
                <th className="text-left py-2">التاريخ</th>
                <th className="text-left py-2">الحالة</th>
                <th className="text-left py-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-center text-gray-500">
                <td colSpan={5} className="py-8">لا توجد حجوزات حالياً</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
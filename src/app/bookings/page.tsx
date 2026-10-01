"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  NO_SHOW: "لم يحضر",
};

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) loadBookings();
  }, [session]);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  const loadBookings = async () => {
    try {
      const data = await apiFetch("/bookings");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "فشل في تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">جارٍ تحميل الحجوزات...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">الحجوزات</h1>
          <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-800">
            تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Link
          href="/bookings/new"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 mb-6"
        >
          حجز جديد
        </Link>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  الخدمة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    لا توجد حجوزات حالياً
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.user?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.service?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(booking.date).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[booking.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {STATUS_LABELS[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => {
                            window.location.href = `/payments?booking=${booking.id}`;
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ادفع الآن
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
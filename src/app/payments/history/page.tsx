"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await apiFetch("/payments/history");
      setPayments(data);
    } catch (err: any) {
      setError(err.message || "فشل في تحميل سجل الدفع");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">جارٍ تحميل سجل الدفع...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">سجل الدفع</h1>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-gray-600 hover:text-gray-800"
          >
            لوحة التحكم
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  رقم الفاتورة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  الخدمة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    لا توجد دفعات سابقة
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {new Date(payment.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {payment.receiptNo || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {payment.booking?.service?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {payment.amount} ريال
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status === "COMPLETED"
                          ? "مكتمل"
                          : payment.status === "PENDING"
                          ? "قيد الانتظار"
                          : payment.status}
                      </span>
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
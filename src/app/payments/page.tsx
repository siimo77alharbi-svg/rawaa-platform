"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { useSearchParams } from "next/navigation";

const PAYMENT_METHODS = [
  { id: "CASH", name: "نقدي", icon: "💵", desc: "ادفع عند الحجز" },
  { id: "CARD", name: "بطاقة", icon: "💳", desc: "فيزا / ماستركارد" },
  { id: "TRANSFER", name: "تحويل بنكي", icon: "🏦", desc: "تحويل مباشر" },
];

function PaymentPageInner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialBookingId = searchParams?.get("booking") || "";

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setProcessing(true);

    try {
      const res = await apiFetch("/payments/process", {
        method: "POST",
        body: JSON.stringify({
          bookingId,
          amount: parseFloat(amount),
          method,
        }),
      });

      setReceipt(res);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء معالجة الدفع");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">الدفع</h1>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-gray-600 hover:text-gray-800"
          >
            لوحة التحكم
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {success && receipt ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">تم الدفع بنجاح</h2>
              <p className="text-gray-600 mt-2">تم إنشاء فاتورة الدفع</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">رقم الفاتورة</span>
                <span className="font-mono font-bold">{receipt.receiptNo}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">المبلغ</span>
                <span className="font-bold text-lg text-blue-600">
                  {receipt.amount} ريال
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">طريقة الدفع</span>
                <span>
                  {PAYMENT_METHODS.find((m) => m.id === receipt.method)?.name ||
                    receipt.method}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">التاريخ</span>
                <span>
                  {new Date(receipt.createdAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {receipt.booking && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الحجز</span>
                  <span>{receipt.booking.service?.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                طباعة الفاتورة
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setReceipt(null);
                  setAmount("");
                  setMethod("");
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                دفعة جديدة
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات الدفع</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الحجز
                </label>
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل رقم الحجز"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ (ريال)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  طريقة الدفع
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        method === m.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{m.icon}</span>
                      <span className="font-semibold text-gray-800 block">
                        {m.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={processing || !bookingId || !amount || !method}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "جارٍ معالجة الدفع..." : "ادفع الآن"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">جارٍ التحميل...</div>}>
      <PaymentPageInner />
    </Suspense>
  );
}
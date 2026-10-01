"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      window.location.href = '/dashboard';
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">إنشاء حساب جديد</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="اسمك الكامل" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
            <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="+9665XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            إنشاء الحساب
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          لديك حساب بالفعل؟{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700">تسجيل الدخول</a>
        </p>
      </div>
    </div>
  );
}
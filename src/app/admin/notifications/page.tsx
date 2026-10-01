"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

type NotificationLog = {
  id: string;
  phone?: string;
  email?: string;
  message?: string;
  subject?: string;
  type: string;
  status: string;
  sentAt: string;
  user?: { name: string };
};

type UserOption = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
};

export default function AdminNotificationsPage() {
  const [smsLogs, setSmsLogs] = useState<NotificationLog[]>([]);
  const [emailLogs, setEmailLogs] = useState<NotificationLog[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [notificationType, setNotificationType] = useState('general');
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const token = () => typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/v1/notifications/logs?limit=100', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setSmsLogs(res.data.smsLogs);
      setEmailLogs(res.data.emailLogs);
    } catch (error) {
      console.error('Failed to fetch notification logs:', error);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/v1/users', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSend = async () => {
    if (!selectedUser) return;
    setSending(true);
    setSuccess('');
    try {
      let res;
      switch (notificationType) {
        case 'booking-confirmation':
          res = await axios.post('/api/v1/notifications/booking-confirmation', { bookingId }, {
            headers: { Authorization: `Bearer ${token()}` },
          });
          break;
        case 'reminder':
          res = await axios.post('/api/v1/notifications/reminder', { bookingId }, {
            headers: { Authorization: `Bearer ${token()}` },
          });
          break;
        case 'promo':
          res = await axios.post('/api/v1/notifications/promo', { userId: selectedUser, offer: message }, {
            headers: { Authorization: `Bearer ${token()}` },
          });
          break;
        default:
          res = await axios.post('/api/v1/notifications/general', { userId: selectedUser, message }, {
            headers: { Authorization: `Bearer ${token()}` },
          });
          break;
      }
      setSuccess('تم إرسال الإشعار بنجاح');
      fetchLogs();
    } catch (error: any) {
      setSuccess('خطأ في إرسال الإشعار: ' + (error.response?.data?.error || 'حدث خطأ'));
    }
    setSending(false);
  };

  const getTypeLabel = (type: string) => {
    const labels: any = {
      BOOKING_CONFIRMATION: 'تأكيد حجز',
      REMINDER: 'تذكير',
      PROMO: 'عرض',
      GENERAL: 'عام',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    if (status === 'SENT' || status === 'DELIVERED') return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  };

  if (loading) {
    return <div className="p-8">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">إدارة الإشعارات</h1>

      {/* Send Notification Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">إرسال إشعار</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المستخدم</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">اختر المستخدم</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع الإشعار</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="general">عام</option>
              <option value="promo">عرض ترويجي</option>
              <option value="booking-confirmation">تأكيد حجز</option>
              <option value="reminder">تذكير بموعد</option>
            </select>
          </div>

          {(notificationType === 'general' || notificationType === 'promo') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {notificationType === 'promo' ? 'نص العرض' : 'الرسالة'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder={notificationType === 'promo' ? 'مثال: خصم 20% على جميع الخدمات' : 'اكتب رسالتك هنا...'}
              />
            </div>
          )}

          {(notificationType === 'booking-confirmation' || notificationType === 'reminder') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معرف الحجز</label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="أدخل معرف الحجز"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !selectedUser}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
        </button>

        {success && (
          <p className="mt-2 text-green-600 font-medium">{success}</p>
        )}
      </div>

      {/* SMS Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">سجل رسائل SMS</h2>
        {smsLogs.length === 0 ? (
          <p className="text-gray-500">لا توجد رسائل SMS بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2">المستخدم</th>
                  <th className="text-right py-2">الهاتف</th>
                  <th className="text-right py-2">النوع</th>
                  <th className="text-right py-2">الحالة</th>
                  <th className="text-right py-2">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {smsLogs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{log.user?.name || '-'}</td>
                    <td className="py-2">{log.phone}</td>
                    <td className="py-2">{getTypeLabel(log.type)}</td>
                    <td className="py-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2 text-sm">{new Date(log.sentAt).toLocaleString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">سجل رسائل البريد الإلكتروني</h2>
        {emailLogs.length === 0 ? (
          <p className="text-gray-500">لا توجد رسائل بريد إلكتروني بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2">المستخدم</th>
                  <th className="text-right py-2">البريد</th>
                  <th className="text-right py-2">الموضوع</th>
                  <th className="text-right py-2">النوع</th>
                  <th className="text-right py-2">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {emailLogs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{log.user?.name || '-'}</td>
                    <td className="py-2">{log.email}</td>
                    <td className="py-2">{log.subject || '-'}</td>
                    <td className="py-2">{getTypeLabel(log.type)}</td>
                    <td className="py-2 text-sm">{new Date(log.sentAt).toLocaleString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(c => c.category === filter));
    }
  }, [filter, courses]);

  async function fetchCourses() {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);

      // Check enrollment status
      if (user) {
        const status = {};
        for (const course of data) {
          status[course.id] = false;
        }
        setEnrollmentStatus(status);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  async function enroll(courseId: number) {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        const newStatus = { ...enrollmentStatus };
        newStatus[courseId] = true;
        setEnrollmentStatus(newStatus);
        alert('تم الحجز بنجاح!');
      } else {
        alert('خطأ في الحجز');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">الدورات والبرامج الصحية</h1>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع الدورات</option>
            <option value="stress">إدارة التوتر</option>
            <option value="sleep">تحسين النوم</option>
            <option value="energy">زيادة الطاقة</option>
            <option value="massage">تقنيات المساج</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm font-medium text-teal-600">{course.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{course.title}</h3>
                </div>

                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-500">
                    <p>المدة: {course.duration}</p>
                    <p>المستوى: {course.level}</p>
                    <p>المشرف: {course.instructor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{course.price} ر.س</p>
                    <p className="text-sm text-gray-500">لكل شخص</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.participants}/{course.maxParticipants} مقعد
                  </span>

                  {enrollmentStatus[course.id] ? (
                    <button disabled className="bg-teal-500 text-white px-4 py-2 rounded-lg">
                      محجوز
                    </button>
                  ) : (
                    <button
                      onClick={() => enroll(course.id)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                      حجز مقعد
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
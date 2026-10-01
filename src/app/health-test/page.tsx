'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HealthTestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      id: 1,
      category: 'stress',
      question: 'هل تشعر بالتوتر والإجهاد في حياتك اليومية؟',
      options: [
        { label: 'نادرًا', value: 10 },
        { label: 'أحيانًا', value: 20 },
        { label: 'غالبًا', value: 30 },
        { label: 'دائمًا', value: 40 }
      ]
    },
    {
      id: 2,
      category: 'sleep',
      question: 'كيف تصف جودة نومك؟',
      options: [
        { label: 'ممتازة', value: 10 },
        { label: 'جيدة', value: 20 },
        { label: 'متوسطة', value: 30 },
        { label: 'سيئة', value: 40 }
      ]
    },
    {
      id: 3,
      category: 'energy',
      question: 'هل تشعر بالنعاس والتعب خلال اليوم؟',
      options: [
        { label: 'نادرًا', value: 10 },
        { label: 'أحيانًا', value: 20 },
        { label: 'غالبًا', value: 30 },
        { label: 'دائمًا', value: 40 }
      ]
    },
    {
      id: 4,
      category: 'skin',
      question: 'هل تعاني من مشاكل في البشرة؟',
      options: [
        { label: 'لا', value: 10 },
        { label: 'بعض المشاكل البسيطة', value: 20 },
        { label: 'مشاكل متوسطة', value: 30 },
        { label: 'مشاكل كبيرة', value: 40 }
      ]
    }
  ];

  function handleAnswer(value: number) {
    const currentQuestion = questions[step];
    setAnswers([...answers, { questionId: currentQuestion.id, category: currentQuestion.category, value }]);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitTest();
    }
  }

  async function submitTest() {
    try {
      const response = await fetch('/api/health-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (response.ok) {
        const results = await response.json();
        // Show results
        console.log('Test results:', results);
        alert('تم تحليل نتائجك! ستظهر التوصيات قريبًا');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  }

  if (step >= questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">جاري تحليل النتائج...</h1>
          <p className="text-gray-600 mt-2">سيتم عرض التوصيات قريبًا</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">الاختبار الصحي الذكي</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-2">السؤال {step + 1} من {questions.length}</p>
            <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-right border-2 border-gray-200 rounded-lg px-6 py-4 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
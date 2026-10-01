import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">رواء</h1>
        <h2 className="max-w-xs text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-4">
          المنصة الرقمية المتكاملة لمنتجع رواء الصحي
        </h2>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-8">
          نظام متكامل لإدارة الحجوزات، العملاء، المدفوعات، الاشتراكات، والإشعارات.
        </p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[158px]"
            href="/login"
          >
            تسجيل الدخول
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/register"
          >
            إنشاء حساب
          </Link>
        </div>
      </main>
    </div>
  );
}

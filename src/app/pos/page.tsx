import React from "react";
import Link from "next/link";

export default function POSPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">نقطة البيع (POS)</h1>
            <Link href="/dashboard" className="btn btn-outline text-sm">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">المنتجات والخدمات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ProductItem name="جلسة تدليك" price={350} image="🧖" />
                <ProductItem name="حمام بخار" price={200} image="🔥" />
                <ProductItem name="تقشير" price={500} image="✨" />
                <ProductItem name="باقة VIP" price={1500} image="👑" />
                <ProductItem name="زيت عطري" price={80} image="🌿" />
                <ProductItem name="صابون طبيعي" price={45} image="🧼" />
              </div>
            </div>
          </div>

          {/* Cart */}
          <div>
            <div className="card p-6 sticky top-4">
              <h2 className="text-lg font-bold text-foreground mb-4">الفاتورة</h2>
              <div className="space-y-3 mb-4">
                <CartItem name="جلسة تدليك" price={350} />
                <CartItem name="زيت عطري" price={80} />
              </div>
              <div className="border-t border-neutral-200 pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span>430 ريال</span>
                </div>
              </div>
              <button className="btn btn-primary w-full py-3">
                ادفع الآن
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductItem({ name, price, image }) {
  return (
    <button className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-all">
      <div className="text-3xl mb-2">{image}</div>
      <div className="font-medium text-foreground text-sm">{name}</div>
      <div className="text-primary-600 font-bold text-sm">{price} ريال</div>
    </button>
  );
}

function CartItem({ name, price }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-foreground">{name}</span>
      <span className="font-medium">{price} ريال</span>
    </div>
  );
}
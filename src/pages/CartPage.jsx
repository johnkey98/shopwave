import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, remove, clear, subtotal } = useCart();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.9;
  const tax = +(subtotal * 0.09).toFixed(2);
  const grandTotal = +(subtotal + shipping + tax).toFixed(2);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      clear();
      navigate(`/order/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-slate-300" />
        <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="btn-accent mt-4">Browse products</button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight">Shopping Cart</h1>
        {items.map((i) => (
          <div key={i.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <img src={i.image} alt={i.name} className="h-24 w-24 rounded-xl object-cover" />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold leading-snug">{i.name}</h3>
                <button onClick={() => remove(i.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-500">${i.price.toFixed(2)} each</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(i.id, i.qty - 1)} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold">{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1)} className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50">
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-extrabold">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={placeOrder} className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-extrabold">Checkout</h2>

        <input required className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="flex gap-3">
          <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input className="input" placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        </div>

        <div className="space-y-1.5 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Tax (9%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between pt-2 text-base font-extrabold">
            <span>Total</span><span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={placing} className="btn-accent w-full py-3">
          {placing ? 'Placing order…' : `Place order — $${grandTotal.toFixed(2)}`}
        </button>
        <p className="text-center text-xs text-slate-400">Free shipping on orders over $100</p>
      </form>
    </div>
  );
}

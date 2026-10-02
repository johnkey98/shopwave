import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Order not found'))))
      .then(setOrder)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="py-20 text-center font-bold">{error}</p>;
  if (!order) return <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />;

  return (
    <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
      <CheckCircle2 size={64} className="mx-auto text-emerald-500" />
      <div>
        <h1 className="text-2xl font-extrabold">Order confirmed! 🎉</h1>
        <p className="mt-1 text-slate-500">
          Order <span className="font-mono font-bold text-slate-800">{order.id}</span> — a receipt was sent to{' '}
          <b>{order.customer.email}</b>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left">
        {order.items.map((i) => (
          <div key={i.id} className="flex justify-between border-b border-slate-100 py-2 text-sm last:border-0">
            <span>
              {i.name} <span className="text-slate-400">× {i.qty}</span>
            </span>
            <span className="font-bold">${i.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between font-extrabold">
          <span>Total paid</span>
          <span>${order.totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="btn-dark">Continue shopping</Link>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Product not found'))))
      .then(setProduct)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-bold">{error}</p>
        <button onClick={() => navigate('/')} className="btn-accent mt-4">Back to shop</button>
      </div>
    );
  }
  if (!product) return <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <img src={product.image} alt={product.name} className="h-full max-h-[480px] w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-wide text-indigo-600">{product.category}</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{product.name}</h1>

          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-bold text-amber-500">
              <Star size={16} className="fill-amber-400 text-amber-400" /> {product.rating}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
          <p className="mt-6 text-4xl font-extrabold">${product.price.toFixed(2)}</p>

          <button
            disabled={product.stock === 0}
            onClick={() => add(product)}
            className="btn-accent mt-6 w-full py-3.5 text-base sm:w-auto"
          >
            <ShoppingCart size={18} /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

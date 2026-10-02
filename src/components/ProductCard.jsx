import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-indigo-600">{product.category}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>
        <h3 className="line-clamp-1 font-bold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-extrabold">${product.price.toFixed(2)}</span>
          {product.stock === 0 ? (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">Sold out</span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              In stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (sort) params.set('sort', sort);

    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setProducts(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search, category, sort]);

  const debounceSearch = useMemo(() => {
    let t;
    return (v) => {
      clearTimeout(t);
      t = setTimeout(() => setSearch(v), 300);
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white sm:p-12">
        <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Gear that works as hard as you do.
        </h1>
        <p className="mt-3 max-w-lg text-white/80">
          Hand-picked tech, home and lifestyle products — with a checkout flow that just works.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Search products…"
            onChange={(e) => debounceSearch(e.target.value)}
          />
        </div>
        <select className="input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort: Featured</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {products.length === 0 && (
            <p className="col-span-full py-16 text-center text-slate-400">
              No products match your filters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

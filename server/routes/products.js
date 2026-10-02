import { Router } from 'express';
import db from '../db.js';

const router = Router();

/**
 * GET /api/products
 * Query params: ?search= &category= &sort=price_asc|price_desc|rating &page= &limit=
 */
router.get('/', (req, res) => {
  const { search = '', category = '', sort = '', page = 1, limit = 12 } = req.query;
  let items = [...db.products];

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category && category !== 'All') {
    items = items.filter((p) => p.category === category);
  }

  const sorters = {
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  if (sorters[sort]) items.sort(sorters[sort]);

  const total = items.length;
  const start = (Math.max(1, +page) - 1) * +limit;
  const paged = items.slice(start, start + +limit);

  res.json({ total, page: +page, limit: +limit, items: paged });
});

/** GET /api/products/categories — distinct category list */
router.get('/categories', (_req, res) => {
  res.json([...new Set(db.products.map((p) => p.category))].sort());
});

/** GET /api/products/:id */
router.get('/:id', (req, res) => {
  const product = db.products.find((p) => p.id === +req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

export default router;

import { Router } from 'express';
import crypto from 'node:crypto';
import db from '../db.js';

const router = Router();

/**
 * POST /api/orders
 * Body: { items: [{ id, qty }], customer: { name, email, address, city, zip } }
 * Server-side price calculation — never trust the client.
 */
router.post('/', (req, res) => {
  const { items, customer } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }
  if (!customer?.name || !customer?.email || !customer?.address) {
    return res.status(400).json({ error: 'Customer name, email and address are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const catalog = db.products;
  const lineItems = [];

  for (const { id, qty } of items) {
    const product = catalog.find((p) => p.id === +id);
    if (!product) return res.status(400).json({ error: `Product ${id} does not exist.` });
    const quantity = Math.max(1, Math.min(99, +qty || 1));
    if (product.stock < quantity) {
      return res.status(409).json({ error: `Insufficient stock for "${product.name}" (${product.stock} left).` });
    }
    lineItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: quantity,
      subtotal: +(product.price * quantity).toFixed(2),
    });
    product.stock -= quantity; // decrement inventory
  }

  const subtotal = +lineItems.reduce((s, li) => s + li.subtotal, 0).toFixed(2);
  const shipping = subtotal > 100 ? 0 : 9.9;
  const tax = +(subtotal * 0.09).toFixed(2);

  const order = {
    id: crypto.randomUUID().slice(0, 8).toUpperCase(),
    items: lineItems,
    customer: { name: customer.name, email: customer.email, city: customer.city || '' },
    totals: { subtotal, shipping, tax, grandTotal: +(subtotal + shipping + tax).toFixed(2) },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  db.saveProducts(catalog);
  db.saveOrder(order);

  res.status(201).json(order);
});

/** GET /api/orders/:id */
router.get('/:id', (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id.toUpperCase());
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

export default router;

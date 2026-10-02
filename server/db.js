import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const SEED_FILE = path.join(__dirname, 'data', 'products.json');

/**
 * Tiny JSON-file persistence layer.
 * Good enough for a demo — swap with Prisma/Postgres in production.
 */
const db = {
  read() {
    if (!fs.existsSync(DB_FILE)) {
      const products = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
      this.write({ products, orders: [] });
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  },

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  },

  get products() {
    return this.read().products;
  },

  saveProducts(products) {
    const data = this.read();
    data.products = products;
    this.write(data);
  },

  get orders() {
    return this.read().orders;
  },

  saveOrder(order) {
    const data = this.read();
    data.orders.push(order);
    this.write(data);
    return order;
  },
};

export default db;

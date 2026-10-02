# 🛒 ShopWave — Full-Stack E-Commerce Store

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/Node-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)

ShopWave is a complete e-commerce reference application: a **React storefront** backed by an **Express REST API** with server-side price calculation, stock management, order validation and persistent JSON storage. It demonstrates the full buyer journey — browsing with search/filter/sort, a product detail page, a persistent cart, a validated checkout form and an order confirmation screen with a real order ID.

The API never trusts the client: totals are recalculated from the database, inventory is decremented atomically per order, and insufficient-stock conflicts return proper `409` responses. The frontend keeps the cart in `localStorage` so a page refresh never loses your items, and the production build is served statically by the same Express server — one process, one port, deploy anywhere.

<!-- 📸 Add screenshots here, e.g.: ![Storefront](screenshots/storefront.png) -->

## ✨ Features

- **Product catalog API** — pagination, full-text search, category filtering and price/rating sorting.
- **Product detail page** — image, rating, live stock badge, add-to-cart with sold-out protection.
- **Persistent cart** — quantity controls, line totals, `localStorage` sync, animated badge counter.
- **Server-validated checkout** — customer form with email validation, server-side totals (shipping free over $100, 9% tax), inventory decrement.
- **Order confirmation** — real order ID lookup endpoint + receipt-style summary.
- **Seed dataset** — 12 realistic products across 8 categories with Unsplash imagery.
- **Production-ready serving** — `npm run build && npm start` serves the SPA + API from one Express process.

## 🧱 Tech Stack

| Layer      | Technology                    |
| ---------- | ----------------------------- |
| Frontend   | React 18, React Router 6      |
| Styling    | Tailwind CSS 3                |
| Backend    | Node.js 18+, Express 4        |
| Storage    | JSON file store (swap-ready)  |
| Tooling    | Vite 5, concurrently          |

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/johnkey98/shopwave.git
cd shopwave

# 2. Install
npm install

# 3. Run API (port 4000) + storefront (port 5173) together
npm run dev
```

Open **http://localhost:5173** — the Vite dev server proxies `/api/*` to the backend automatically.

### Production mode

```bash
npm run build
npm start          # serves API + built SPA on http://localhost:4000
```

## 📡 API Reference

Base URL: `/api`

| Method | Endpoint               | Description                                            |
| ------ | ---------------------- | ------------------------------------------------------ |
| GET    | `/health`              | Service heartbeat + uptime                             |
| GET    | `/products`            | List products — `?search= &category= &sort= &page= &limit=` |
| GET    | `/products/categories` | Distinct categories                                    |
| GET    | `/products/:id`        | Single product                                         |
| POST   | `/orders`              | Create order `{ items: [{id, qty}], customer: {...} }` |
| GET    | `/orders/:id`          | Fetch order by ID                                      |

### Example — place an order

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{ "id": 1, "qty": 2 }, { "id": 11, "qty": 1 }],
    "customer": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "address": "42 Market St",
      "city": "Springfield"
    }
  }'
```

Response `201`:

```json
{
  "id": "A1B2C3D4",
  "items": [...],
  "totals": { "subtotal": 432.9, "shipping": 0, "tax": 38.96, "grandTotal": 471.86 },
  "status": "confirmed"
}
```

## 📂 Project Structure

```
shopwave/
├── server/
│   ├── index.js              # Express bootstrap + SPA serving
│   ├── db.js                 # JSON persistence layer
│   ├── data/products.json    # Seed catalog
│   └── routes/
│       ├── products.js       # Catalog endpoints
│       └── orders.js         # Checkout + order lookup
└── src/
    ├── App.jsx               # Routes + layout
    ├── context/CartContext.jsx
    ├── components/           # Header, ProductCard
    └── pages/                # Home, ProductPage, CartPage, OrderSuccess
```

## 🗺 Roadmap

- [ ] Stripe checkout integration
- [ ] Admin dashboard (reuse of [nova-admin](https://github.com/johnkey98/nova-admin))
- [ ] Auth + order history per user
- [ ] Postgres/Prisma storage adapter
- [ ] Dockerfile + docker-compose

## 📄 License

[MIT](LICENSE) © [John Key](https://github.com/johnkey98)

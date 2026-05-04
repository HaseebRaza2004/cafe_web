# 🍔 Cafe WaaS (Website as a Service) - Premium Luxury Dining Platform

Welcome to the **Cafe WaaS** project! This is a premium, subscription-based digital ordering platform designed specifically for luxury cafes and restaurants. Built with a mobile-first approach, it offers a seamless ordering experience for customers and a powerful management dashboard for cafe owners.

## 🚀 Tech Stack

This project is built using the latest and most robust web technologies:
*   **Framework:** [Next.js 16.2+](https://nextjs.org/) (App Router, Server-Side Rendering, API Routes)
*   **Styling:** [Tailwind CSS v4+](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Database:** [MongoDB 9+](https://www.mongodb.com/) (Mongoose)
*   **Image Optimization:** [Cloudinary](https://cloudinary.com/) (Custom Loader)
*   **Analytics:** Google Analytics 4 (GA4) Integration

---

## ✨ Key Features

### 🛒 Customer Experience (Frontend)
*   **Premium Glassmorphism UI:** Dark-themed luxury design with gold accents and smooth micro-interactions.
*   **Instant Search & Filtering:** Real-time, zero-lag menu search filtering items and categories instantly.
*   **Dynamic Item Modals:** 
    *   *Products:* Advanced add-ons, quantity selectors, and dynamic price calculation.
    *   *Deals:* Multi-step selectors (e.g., "Choose 1 Burger", "Choose 1 Drink") for combo deals.
*   **Smart Cart & Delivery Zones:** Dynamic delivery fee calculation based on selected zones and live 15% Tax computation.
*   **WhatsApp Integration:** Checkout directly sends a structured, automated order receipt to the Cafe's WhatsApp—no user login required!
*   **Live Order Tracking:** Customers can track their order status in real-time via the Order Success page and a floating "Order Tracker" pill.
*   **Deep Linking:** Shareable links for specific products and deals that open directly into the respective modals.

### 👑 Admin Control Panel (Backend)
*   **Secret VVIP Login:** Hidden admin access point (invisible dot in the footer) to maintain brand aesthetics while ensuring security.
*   **Analytics Dashboard:** Visual charts for Revenue, Traffic, Order Status, and Top-Selling items.
*   **Order Management:** Real-time interface to accept, prepare, and dispatch orders.
*   **Menu Management:** Full CRUD operations for Categories, Products, Deals, and Option Groups (Add-ons).
*   **Store Settings:** Toggle shop status (Open/Close), update delivery fees, and modify store timings dynamically.

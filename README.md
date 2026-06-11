# BitGold — Premium Physical Gold Investment Ecosystem

![BitGold Header](https://images.unsplash.com/photo-1610486800762-c651b75c8b21?q=80&w=1932&auto=format&fit=crop)

BitGold is a high-fidelity fintech platform designed to bridge the gap between digital convenience and physical wealth. By leveraging real-time market data, automated investment algorithms, and secure cloud infrastructure, BitGold empowers users to build a tangible gold reserve effortlessly.

Built with a **Gold-Standard** tech stack, BitGold transforms every daily transaction into a step toward financial sovereignty.

---

## 💎 The Experience

BitGold is designed with a **Premium Dark** aesthetic, prioritizing immersive visuals and fluid interactions.

*   **Mobile-First Precision:** Every component is optimized for touch, featuring interactive gold-gradient elements and glassmorphic card designs.
*   **Real-Time Fidelity:** Live XAU/USD market tracking with sub-second price updates and high-resolution historical charting.
*   **The "Vault" Concept:** User assets are visualized as physical holdings, emphasizing the transition from digital currency to real-world gold.

---

## 🚀 Core Features

### 🏦 Automated Investment Engine
*   **Spare Change Round-Ups:** Sync your daily spending; every transaction is rounded to the nearest dollar, with the "spare change" instantly converted into 99.9% pure gold.
*   **Auto-Pilot (SIP):** Set-and-forget recurring purchase plans. Build your wealth on a daily, weekly, or monthly schedule.
*   **Smart Portfolio Rebalancing:** Visual asset allocation tracking between liquid CAD and physical Gold holdings.

### 🛡️ Secure Infrastructure
*   **Unique Demo Identities:** An "Instant Demo Mode" that generates isolated session identities, allowing users to experiment with $10,000 of simulated capital in a sandboxed database environment.
*   **Cloud Persistence:** Seamlessly upgrade from Demo to Cloud via Clerk, syncing all progress and settings to a permanent, secure profile.
*   **Vault Security:** Multi-layer protection including biometrics (simulated), 2FA, and real-time transaction audit logs.

### 📦 Physical Redemption
*   **Real-Asset Backing:** Every gram in the digital vault represents real-world physical stock.
*   **Global Delivery:** Request physical fulfillment in the form of certified 1g chips, 5g coins, or 10g Swiss-minted bars, delivered securely to your door.

---

## 🛠️ Technical Architecture

BitGold utilizes a state-of-the-art serverless architecture to ensure zero-latency data binding and maximum security.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | High-performance, type-safe UI |
| **Backend** | Convex | Serverless real-time database & functions |
| **Auth** | Clerk | Identity management & JWT security |
| **Styling** | Tailwind CSS | Utility-first, premium dark-mode design |
| **Motion** | Framer Motion | Fluid transitions & micro-interactions |
| **Monitoring**| Sentry | Real-time error tracking & performance |
| **API** | CoinGecko | Market-accurate Gold/USD pricing |

---

## 📦 Installation & Setup

### 1. Environment Configuration
Create a `.env.local` file in the root directory and provide the following keys:

```env
# Convex Backend
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Sentry Monitoring
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
```

### 2. Dependency Management
```bash
# Install required packages
npm install

# Start the full-stack development environment
npm run dev
```

### 3. Build for Production
```bash
# Generate optimized production bundle
npm run build
```

---

## 📐 Project Structure

```text
├── convex/             # Backend functions, schema, and auth config
│   ├── users.ts        # Identity syncing & balance management
│   ├── transactions.ts # Trade execution logic
│   └── banking.ts      # Bank linking & redemption flows
├── src/
│   ├── components/     # Atomic UI units & layout elements
│   ├── context/        # Global state for gold pricing & demo modes
│   ├── hooks/          # useCurrentUser & other custom logic
│   ├── lib/            # Gold API & utility functions
│   └── pages/          # High-level route components
```

---

## 🛡️ Stability & Monitoring

To ensure financial-grade reliability, BitGold is integrated with **Sentry**. This provides:
*   **Breadcrumbs:** Detailed logs of user actions leading up to an error.
*   **Session Replays:** Visual reconstructions of bugs to accelerate fixes.
*   **Performance Metrics:** Tracking of backend mutation speeds and API response latencies.

---

## 📜 Disclaimer
BitGold is a financial simulator. No real money is processed, and all gold holdings are simulated for educational and demonstration purposes.

---
*Built for the future of physical asset investment.*

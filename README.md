# 🚗 Vehiqo — Vehicle Rental System (Frontend)

Vehiqo is a modern, production-ready **Vehicle Rental System** frontend built with **Next.js** and **TypeScript**. It provides a seamless rental experience for customers and a powerful management interface for admins — from vehicle browsing and booking to payments and reviews.

The frontend connects to the [Vehiqo Backend REST API](https://vehiqo-backend.vercel.app) and supports a complete rental workflow: vehicle discovery, booking, advance payment, pickup, return, and final billing.

---

## 🌐 Live Demo

**URL:** [https://vehiqo-frontend.vercel.app](https://vehiqo-frontend.vercel.app)

---

## 🧰 Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js (App Router)    |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Auth       | Better Auth             |
| API        | Vehiqo Backend REST API |
| Deployment | Vercel                  |


---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://vehiqo-backend.vercel.app/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/meshal10613/vehiqo-frontend.git
cd vehiqo-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Pages & Routes

### Public Routes

| Route           | Description                            |
| --------------- | -------------------------------------- |
| `/`             | Landing page with hero, stats, and FAQ |
| `/vehicles`     | Browse all available vehicles          |
| `/vehicles/:id` | Vehicle detail with booking form       |
| `/about`        | About Vehiqo                           |
| `/contact`      | Contact form and info                  |

### Auth Routes

| Route      | Description                   |
| ---------- | ----------------------------- |
| `/sign-in` | Login with email & password   |
| `/sign-up` | Create a new customer account |

### Customer Routes (Protected)

| Route          | Description                       |
| -------------- | --------------------------------- |
| `/my-bookings` | View and manage personal bookings |
| `/my-profile`  | View and update profile           |

### Admin Routes (Protected)

| Route        | Description                                       |
| ------------ | ------------------------------------------------- |
| `/dashboard` | Admin dashboard with fleet and booking management |

---

## 🔖 Booking Lifecycle

```
PENDING → ADVANCE_PAID → PICKED_UP → RETURNED → COMPLETED
```

| Status         | Description                         |
| -------------- | ----------------------------------- |
| `PENDING`      | Booking created, awaiting payment   |
| `ADVANCE_PAID` | Advance payment received            |
| `PICKED_UP`    | Vehicle handed over to customer     |
| `RETURNED`     | Vehicle returned by customer        |
| `COMPLETED`    | Booking finalized with full billing |

---

## 🛡️ User Roles

| Role       | Access                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| `ADMIN`    | Full dashboard access — manage vehicles, bookings, users, fuel pricing |
| `CUSTOMER` | Browse vehicles, make bookings, manage profile, leave reviews          |

---

## 💰 Billing Summary (at Return)

- **Advance payment** — fixed, collected at booking time
- **Late fee** — 10% surcharge per extra day beyond agreed return date
- **Fuel charge** — monetary delta between pickup and return fuel level (surplus credited back)
- **Damage charge** — manually applied by admin post-return

---

## 📦 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## 🔗 Links

- **Backend Repo:** [github.com/meshal10613/vehiqo-backend](https://github.com/meshal10613/vehiqo-backend)
- **Live API:** [vehiqo-backend.vercel.app](https://vehiqo-backend.vercel.app)
- **Portfolio:** [syedmohiuddinmeshal.netlify.app](https://syedmohiuddinmeshal.netlify.app)
- **LinkedIn:** [linkedin.com/in/10613-meshal](https://linkedin.com/in/10613-meshal)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

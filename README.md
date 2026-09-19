# HomelyHub

> A full-stack vacation-rental marketplace built on the MERN stack. Guests search, filter and book stays. Hosts list properties with AI-assisted descriptions; an LLM trip planner builds itineraries around the platform's own listings.
>
> Built as part of an internship programme to learn the MERN stack hands-on.


![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?logo=redux&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend setup](#backend-setup)
  - [Frontend setup](#frontend-setup)
  - [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Project structure](#project-structure)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

**For guests**
- Browse and search listings by city, dates and guest count
- Filter by property type, room type, amenities and price range
- View a listing with an embedded map (geocoded from the stored address)
- Book a stay and manage bookings from a personal dashboard
- AI Trip Planner — generates a day-by-day itinerary for a destination, budget and interest set, and cross-references it against real listings that fit the budget and guest count

**For hosts**
- List a property through a multi-step form (photos, address, amenities, pricing, house rules)
- One-click AI-generated listing description, grounded strictly in the details entered — no invented amenities or embellishments
- View and manage "My Accommodations"

**Platform**
- JWT-based authentication with httpOnly cookies
- Password reset via emailed, hashed single-use tokens
- Role-based access (`user` / `admin`)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Redux Toolkit, TanStack Form, Axios, React-Leaflet |
| Backend | Node.js, Express (ESM) |
| Database | MongoDB, Mongoose |
| Auth | JWT + httpOnly cookies, bcrypt |
| Image storage | ImageKit |
| Email | Nodemailer + Mailgen (SMTP via Mailtrap in dev) |
| AI | Groq SDK (`openai/gpt-oss-120b`) — listing descriptions & trip planning |
| Maps / geocoding | React-Leaflet + OpenStreetMap Nominatim (no API key required) |

---

## Architecture

```
React SPA  →  Axios (withCredentials)  →  Express API  →  MongoDB
                                              │
                                              ├──→ ImageKit        (property & profile photos)
                                              ├──→ Groq LLM API    (descriptions & trip plans)
                                              └──→ SMTP            (password reset emails)
```

Backend follows a **routes → controllers → models** layering, with cross-cutting logic isolated into `utils/` (JWT/cookie helpers, query building, image upload, email) and `ai/` (all LLM/Groq logic, kept out of the controllers so the provider is swappable).

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- A MongoDB instance (local or Atlas)
- Accounts/API keys for: ImageKit, Groq, and an SMTP provider (e.g. Mailtrap)

### Backend setup

```bash
cd backend
npm install
# create a .env file — see Environment variables below
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

### Environment variables

Create a `.env` file in the backend root with the following:

```env
# Server
PORT=8080
NODE_ENV=development
ORIGIN_ACCESS_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# ImageKit
IMAGEKIT_PUBLICKEY=your_imagekit_public_key
IMAGEKIT_PRIVATEKEY=your_imagekit_private_key
IMAGEKIT_URLENDPOINT=your_imagekit_url_endpoint

# Email (SMTP)
MAILTRAP_SMTP_HOST=your_smtp_host
MAILTRAP_SMTP_PORT=your_smtp_port
MAILTRAP_SMTP_USER=your_smtp_user
MAILTRAP_SMTP_PASS=your_smtp_password

# AI
GROQ_API_KEY=your_groq_api_key
```

> `JWT_COOKIE_EXPIRES_IN` is a plain number of days (multiplied internally), not a duration string.

---

## API overview

All routes are prefixed with `/api/v1/rent`.

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/user/signup` | Register a new user | No |
| POST | `/user/login` | Log in, sets JWT cookie | No |
| GET | `/user/logout` | Clear the JWT cookie | No |
| POST | `/user/forgotPassword` | Request a password reset email | No |
| PATCH | `/user/resetPassword/:token` | Reset password with emailed token | No |
| GET | `/user/me` | Get current logged-in user | Yes |
| PATCH | `/user/updateMe` | Update name / phone / avatar | Yes |
| GET | `/listing` | Search & filter properties (query params) | No |
| GET | `/listing/:id` | Get a single property | No |
| POST | `/user/newAccommodation` | Create a new listing | Yes |
| GET | `/user/myAccommodation` | List the current host's properties | Yes |
| POST | `/user/generateDescription` | AI-generate a listing description | Yes |
| POST | `/booking/create-order` | Start a booking/payment flow | Yes |
| POST | `/booking/verify-payment` | Confirm booking after payment | Yes |
| GET | `/booking/mybookings` | Get the current user's bookings | Yes |
| POST | `/trip/plan` | AI trip planner | Yes |

---

## Project structure

```
backend/
├── ai/            # Groq client + prompt logic (descriptions, trip planner)
├── controllers/   # Request handlers
├── middleware/    # Auth guard (protect), error handling
├── models/        # Mongoose schemas (User, Property, Booking)
├── routes/        # Route definitions
├── utils/         # JWT/cookie helpers, query builder, image upload, mail
└── index.js       # App entry point

frontend/
├── src/
│   ├── components/  # UI components, grouped by feature
│   ├── store/       # Redux Toolkit slices + actions
│   ├── ai/          # Frontend hooks for AI features
│   └── utils/       # Shared Axios instance, helpers
```

---

## Known limitations

Being upfront about these rather than presenting the project as production-ready:

- **Payment is simulated**, not integrated with a real gateway — the two-phase create-order → verify-payment shape mirrors Razorpay/Stripe, but the actual charge is mocked.
- **No token revocation** — a stolen JWT remains valid until it expires or the password is changed; there's no server-side session kill switch.
- **No rate limiting** on auth endpoints yet.
- **No transactional locking** on the booking-availability check, so a race condition between two near-simultaneous bookings is theoretically possible.

---

## Roadmap

- [ ] Integrate a real payment gateway (Razorpay/Stripe)
- [ ] Add rate limiting on auth routes
- [ ] Add refresh-token rotation and session revocation
- [ ] Wrap the booking-availability check in a database transaction

---

## License

MIT — see [LICENSE](LICENSE) for details.

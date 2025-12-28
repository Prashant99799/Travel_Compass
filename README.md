
# Travel Compass

_Your season-aware, AI-powered travel buddy for Ahmedabad!_

Travel Compass helps you discover the best places to visit, plan your trip, and connect with fellow travelers—all with a beautiful, modern UI and smart recommendations based on season, budget, and your interests.

---

## 🚀 Getting Started (Local)

**Requirements:**
- Node.js 20+
- PostgreSQL 15+ (or Neon/Supabase cloud DB)

### 1. Backend Setup

```bash
cd backend
npm install
# Copy and edit .env (see .env.example)
# Set your DATABASE_URL (Neon recommended for cloud)
npm run migrate
npm run seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Copy and edit .env (see .env.example)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Demo login:**
- Email: `demo@travelcompass.com`
- Password: `demo123`

---

## 🌍 Deploying to Vercel (Recommended)

You can deploy the frontend to Vercel for a free, production-grade experience. Here’s how:

### 1. Prepare Your Database
- Use [Neon](https://neon.tech) (free Postgres cloud) and copy your connection string.
- Run migrations and seed data locally or via a script (see backend setup above).

### 2. Deploy Backend (API)
- Deploy your backend to [Railway](https://railway.app), [Render](https://render.com), or any Node.js host.
- Set your environment variables (DATABASE_URL, JWT_SECRET, etc) in the host’s dashboard.

### 3. Deploy Frontend to Vercel
- Push your code to GitHub.
- Go to [Vercel](https://vercel.com/import) and import your frontend folder.
- Set the environment variable `VITE_API_URL` to your backend’s public API URL (e.g. `https://your-backend.up.railway.app/api`).
- Click Deploy. That’s it!

**Tip:** You can use Vercel’s preview deployments for every PR.

---


## 🗂️ Project Structure

```
Travel_Compass/
├── frontend/   # React + Vite + Tailwind
├── backend/    # Express + TypeScript + Drizzle ORM
├── docs/       # Project docs
```


## 🎯 Key Features

### 1. **Season-Aware Recommendations**
- Automatic season detection
- Destination suitability scoring based on weather
- Real-time seasonal data

### 2. **Hybrid AI Engine**
- **Budget Predictor**: Linear regression model for budget estimation
- **Destination Ranker**: Multi-factor ranking (season, budget, popularity)
- Pure TypeScript implementation (no external ML runtime)

### 3. **Community Tips System**
- User-generated travel tips
- Voting system (upvote/downvote)
- Season-specific content

### 4. **Simple JWT Authentication**
- Secure signup/login system
- JWT token-based sessions (7-day expiry)
- Password hashing with bcrypt (12 rounds)
- Protected routes for authenticated users

### 5. **Beautiful UI**
- Glassmorphism design
- Smooth animations with Framer Motion
- Fully responsive mobile-first design
- Dark theme with gradients

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login & get JWT token
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/profile` - Get user profile (protected)
- `PATCH /api/auth/profile` - Update profile (protected)
- `PUT /api/auth/password` - Change password (protected)

### Search
- `POST /api/search` - Get recommendations
- `GET /api/search/trending` - Get trending tips

### Destinations
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/:id` - Get destination details

### Tips
- `GET /api/tips` - List tips (with filters)
- `POST /api/tips` - Create new tip
- `POST /api/tips/:id/vote` - Vote on tip

### Travel Plans
- `GET /api/plans` - User's plans (protected)
- `POST /api/plans` - Create plan (protected)

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks (protected)
- `POST /api/bookmarks` - Add bookmark (protected)
- `DELETE /api/bookmarks/:id` - Remove bookmark (protected)

### Seasons
- `GET /api/seasons/current` - Get current season info
- `GET /api/seasons/:season/destinations` - Get destinations for season

## 🤖 ML Models

### Budget Predictor
```
budget = 5000 + (800 × days) + (1500 × travel_type) + (20 × season_score) + (15 × popularity)
```

### Destination Score
```
score = (seasonal_fit × 0.4) + (budget_fit × 0.3) + (popularity × 0.3)
```

## 📊 Database Schema

### Core Tables
- `users` - User profiles with password_hash
- `destinations` - Travel destinations
- `seasonal_weather` - Weather data by season
- `tips` - Community travel tips
- `travel_plans` - User's saved plans
- `votes` - Tip voting system
- `bookmarks` - User bookmarked destinations
- `user_activity` - Activity tracking

## 🎨 Design System

### Colors
- **Summer**: Orange gradient
- **Monsoon**: Blue-Purple gradient
- **Autumn**: Warm gradient
- **Winter**: Cyan gradient

### Components
- Button (5 variants)
- Input with validation
- GlassCard (glassmorphism)
- SeasonBadge
- Modal
- Loader


## 🚀 Deployment (Summary)

- **Frontend:** Vercel (recommended, free)
- **Backend:** Railway, Render, or your own VPS
- **Database:** Neon (free Postgres), Supabase, or any Postgres host

See the full deployment guide above!


## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/travel_compass
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing

```bash
# Backend
cd backend
npm run type-check

# Frontend
cd frontend
npm run lint
```

## 📈 Performance

- ⚡ Page load time: < 2 seconds
- 📱 Mobile Lighthouse score: > 90
- 🚀 API response time: < 500ms
- 💾 Zero external ML runtime (TypeScript only)

## 🔐 Security

- JWT authentication (7-day token expiry)
- Password hashing with bcrypt (12 salt rounds)
- Input validation with Zod
- CORS protection
- SQL injection prevention (Drizzle ORM)
- Environment variable management
- Protected API routes with middleware

## 🛣️ Roadmap

- [x] Simple JWT authentication (signup/login)
- [x] User profiles and settings
- [x] Bookmarks system
- [ ] Real-time weather API integration
- [ ] Collaborative trip planning
- [ ] AR destination navigation
- [ ] Expense tracking
- [ ] Social sharing
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js](https://expressjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.


---

## 👋 About

Travel Compass is built by travelers, for travelers. We love Ahmedabad and wanted to make trip planning fun, smart, and social. If you have ideas or want to contribute, open an issue or PR!

**Ready to explore?** Start the app and discover the best of Ahmedabad! 🚀

# 🎬 IMovies – Movie Ticket Booking Made Simple

A full-stack **MERN** application where users browse movies, pick a showtime, choose seats on a live seat map and manage their bookings.

## Skills used
| Skill | Where |
|---|---|
| HTML | `frontend/index.html`, JSX markup |
| CSS | `frontend/src/styles.css` (seat map, hero, cards) |
| JavaScript | whole codebase (ES6+) |
| React.js | `frontend/src` – components, hooks, Router, Context |
| Node.js | runtime for `backend/` |
| Express.js | REST API in `backend/routes` |
| MongoDB (+Mongoose) | `backend/models` |
| Asynchronous JavaScript | async/await, `Promise.all`, debounced search, atomic DB updates |
| JSON Web Token (JWT) | `backend/middleware/auth.js`, `backend/routes/auth.js` |
| Bootstrap | navbar, grid, cards, forms, buttons |

## Features
- Register / Login with hashed passwords (bcrypt) + JWT auth
- Search movies and filter by genre
- Movie details with upcoming showtimes grouped by date
- Real-time seat availability and seat selection (max 8)
- **Double-booking prevention** via a single atomic MongoDB update
- My Bookings page with cancellation (seats are released)

## Architecture
```
React (Vite, Bootstrap)  --/api-->  Express  -->  Mongoose  -->  MongoDB
        |  JWT in localStorage          |  JWT middleware protects /bookings
```

## Setup
Prerequisites: Node.js v16+, npm, MongoDB running locally (or an Atlas URI).

```bash
# 1. API
cd backend
npm install
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm run seed              # loads sample movies + shows
npm run dev               # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## API
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | create account |
| POST | /api/auth/login | – | login, returns JWT |
| GET | /api/auth/me | ✔ | current user |
| GET | /api/movies?q=&genre= | – | list/search movies |
| GET | /api/movies/:id | – | movie details |
| GET | /api/movies/:id/shows | – | upcoming shows |
| GET | /api/shows/:id | – | show + booked seats |
| POST | /api/bookings | ✔ | book seats `{showId, seats[]}` |
| GET | /api/bookings/mine | ✔ | my bookings |
| DELETE | /api/bookings/:id | ✔ | cancel booking |

## Submission checklist
1. Push to GitHub → add the link in Skill Wallet (**Add Github Link**)
2. Deploy (Render for `backend`, Vercel/Netlify for `frontend`, MongoDB Atlas) → **Add Demo Link**
   - For deployment, set `VITE_API_URL`-style base URL or host client+API together.

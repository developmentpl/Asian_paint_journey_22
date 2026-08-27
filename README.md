# Road Safety in Rain — Interactive Two-Wheeler Safety Game

An interactive, story-driven road-safety training game. The player rides a
motorcycle through a rainy journey made up of 10 real-world decision
scenarios (heavy rain, waterlogging, potholes, pedestrian crossings,
cornering on wet roads, and more). Every decision is scored **on the
backend**, saved to MySQL immediately, and reviewable at the end.

Built as a full-stack app: **React (Vite)** frontend, **Node.js + Express**
backend, **MySQL** for scoring/game state, and **Google Sheets via Apps
Script** for player registration data.

---

## 1. Project structure

```
road-safety-game/
├── database.sql              # Full MySQL schema + seed data
├── setup.bat                 # Installs deps + imports the DB (Windows)
├── start.bat                 # Starts backend + frontend + opens browser
├── backend/
│   ├── config/db.js          # MySQL connection pool
│   ├── controllers/          # playerController.js, gameController.js
│   ├── routes/                # playerRoutes.js, gameRoutes.js, questionRoutes.js
│   ├── models/                # Player.js, GameSession.js, PlayerAnswer.js
│   ├── data/questions.js      # The 10 scenarios — source of truth for scoring
│   ├── middleware/            # errorHandler.js, validators.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/        # PlayerForm, EmployeeDetails, WelcomeScreen,
    │   │                       # Countdown, GameScreen, Scenario, AnswerOptions,
    │   │                       # FeedbackModal, ScoreHUD, ProgressBar, RainEffect,
    │   │                       # BikeScene, AudioManager, ScoreBoard, ResultsReview
    │   ├── pages/              # Registration, Welcome, Game, Results
    │   ├── data/                # questions.js (display copy), plants.js
    │   ├── assets/audio/        # background.mp3, rain.mp3, correct.mp3, wrong.mp3,
    │   │                        # countdown.mp3, game-complete.mp3 (placeholders — replace freely)
    │   ├── services/api.js      # Axios wrapper for all backend calls
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

---

## 2. Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.x (or MariaDB 10.x) running locally, with a root user you can connect as
- Windows 10/11 (batch files are Windows-specific; the Node/React app itself runs anywhere)

---

## 3. Quick start (Windows)

1. Double-click **`setup.bat`**. It will:
   - Import `database.sql` into MySQL (prompts for your MySQL root password).
   - Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`.
   - Run `npm install` for both backend and frontend.
2. Open `backend/.env` and set your real MySQL username/password if different from the defaults.
3. Double-click **`start.bat`**. It opens two terminal windows (backend on port 3000,
   frontend on port 5173) and launches the game in your browser automatically.

## 4. Manual setup (any OS)

```bash
# 1. Create the database and tables
# (On Windows terminals especially, avoid "mysql -p < database.sql" — piping the
#  file into stdin while -p also needs stdin free for the password prompt can
#  corrupt the password mysql receives. Use -e "source ..." instead:)
mysql -u root -p -e "source database.sql"

# 2. Backend
cd backend
cp .env.example .env      # edit DB credentials inside
npm install
npm start                 # http://localhost:3000

# 3. Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 5. Environment variables

**`backend/.env`**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=road_safety_game
DB_PORT=3306
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Google Apps Script code and deployment instructions are in
`google-apps-script/Code.gs` and `google-apps-script/DEPLOYMENT.md`.
Each registration creates a unique Sheet attempt row. Finish and Play Again
update that same row with the final backend-computed score before continuing.

---

## 6. Game flow

Name/Email → Employee ID/Plant → Welcome & rules → 3-2-1-GO countdown →
10 rainy-road scenarios (each: situation → decision → instant scored
feedback) → animated final scoreboard → performance message → optional
"Review Your Decisions" → Play Again / Finish.

- **Scoring**: 10 points per correct answer, 0 for incorrect, max 100.
  **All scoring happens on the backend** (`backend/controllers/gameController.js`) —
  the frontend only ever sends the selected option index, never a score.
- **Anti-duplicate protection**: once an answer is submitted, the answer
  buttons disable immediately (before the network call even returns), and
  the database has a `UNIQUE (session_id, question_id)` constraint so the
  same scenario can never be scored twice in one session, even under a race.
- **Refresh protection**: `sessionId` is kept in `sessionStorage`. On reload,
  the app asks the backend which questions are already answered and what the
  real score is (`GET /api/game/:sessionId`) and resumes there — it never
  trusts locally-cached score/progress.

---

## 7. REST API reference

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/players` | Create an anonymous scoring identity (empty body; registration PII is not sent) |
| POST | `/api/game/start` | Start a session for a player (`playerId`) |
| GET | `/api/game/:sessionId` | Current session state + answered question IDs (refresh recovery) |
| POST | `/api/game/answer` | Submit one answer (`sessionId, questionId, selectedAnswer`) — backend verifies correctness and updates score |
| POST | `/api/game/complete` | Mark a session COMPLETED |
| GET | `/api/game/:sessionId/results` | Final score + full per-question review |
| GET | `/api/questions` | The scenario bank (for tooling/reference) |
| GET | `/api/health` | Health check |

---

## 8. Database schema

See `database.sql` for the full script (creates the DB, tables, keys,
indexes and seeds the `questions` table). Tables: `players`,
`game_sessions`, `player_answers`, `questions`.

`player_answers` has a `UNIQUE (session_id, question_id)` constraint — this
is the hard backend guarantee against duplicate scoring described above.

---

## 9. Customizing the game

- **Plants dropdown** — edit `frontend/src/data/plants.js`.
- **Scenarios/questions** — edit `backend/data/questions.js` (this is what
  actually scores answers) **and** mirror the same changes in
  `frontend/src/data/questions.js` (used for rendering only). Each object
  documents its own fields.
- **Audio** — replace any file in `frontend/src/assets/audio/` (same
  filenames: `background.mp3`, `rain.mp3`, `correct.mp3`, `wrong.mp3`,
  `countdown.mp3`, `game-complete.mp3`). The included files are simple
  generated placeholders — swap in real sound design any time.
- **Visuals** — the rainy road/bike scene (`frontend/src/components/BikeScene.jsx`)
  is built from CSS + emoji so it needs zero image assets out of the box.
  Replace the emoji/CSS shapes with real illustrations or sprites later —
  the animation classes in `index.css` don't need to change.

---

## 10. Troubleshooting

- **`Access denied for user 'root'@'localhost'` (or any user@host) even though
  the password you typed looks right** — two separate things can cause this,
  check both:
  1. **Wrong server/user entirely.** If your MySQL isn't a local install with
     `root` (e.g. it's a shared/corporate server on the network, like
     `192.168.x.x` with a named user such as `developer`), `setup.bat` needs
     `backend/.env` filled in with the *real* `DB_HOST`/`DB_PORT`/`DB_USER`/
     `DB_PASSWORD` **before** you run it — it now reads those values from
     `backend/.env` to run the import, instead of assuming local root. If
     `backend/.env` doesn't exist yet, `setup.bat` will create it from the
     example and stop, asking you to fill it in first.
  2. **A known Windows-terminal quirk** with `mysql -p < database.sql` —
     redirecting the SQL file into stdin conflicts with the interactive
     password prompt, which also wants stdin, and can corrupt the password
     mysql actually receives. `setup.bat` and the manual command above both
     use `mysql ... -p -e "source database.sql"` instead, which avoids it.
  To isolate which one you're hitting, test the exact credentials by hand
  first: `mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p` — if that alone
  fails, it's a credentials/permissions issue with your DBA/MySQL admin, not
  this app.
- **Backend logs `MySQL connection failed`** — confirm MySQL is running,
  `database.sql` has been imported, and `backend/.env` credentials are correct.
  Remember the backend (`backend/.env`) and the `mysql` CLI use separate
  credential entry points — fixing one doesn't fix the other; both need the
  correct password.
- **Frontend can't reach the API** — confirm the backend is running on the
  port in `frontend/.env` (`VITE_API_BASE_URL`) and that `FRONTEND_ORIGIN`
  in `backend/.env` matches the frontend's actual URL (CORS).
- **"This scenario has already been answered"** — expected behavior; it
  means the session already has a saved answer for that question (e.g. a
  refresh happened mid-answer). The game will still show the previously
  recorded result and let you continue.

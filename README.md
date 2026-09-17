# Road Safety in Rain — Interactive Two-Wheeler Safety Game

An interactive, story-driven road-safety training game. The player rides a
motorcycle through a rainy journey made up of 10 real-world decision
scenarios (heavy rain, waterlogging, potholes, pedestrian crossings,
cornering on wet roads, and more), in English or Hindi, with voice
narration. Each decision gets instant feedback and can be reviewed at the
end.

The game is a **static React (Vite) website**. There is no backend server
and no database: the game runs in the browser, and **Google Sheets (via
Apps Script)** stores each player's registration and final result.

---

## 1. Project structure

```
Asian_paint_journey_22/
├── setup.bat                  # Creates frontend/.env and installs packages (Windows)
├── start.bat                  # Runs the game locally and opens the browser
├── build.bat                  # Builds the website files for hosting (frontend/dist)
├── ASSETS.md                  # Visual asset reference
├── google-apps-script/
│   ├── Code.gs                # Google Sheets web app (registration + results + answer key)
│   └── DEPLOYMENT.md          # How to deploy it
└── frontend/
    ├── public/                # Audio narration and image assets (served as-is)
    ├── src/
    │   ├── components/        # Road scene, rider, HUD, question panel, scoreboard, …
    │   ├── pages/             # Registration, Instructions, Game, Results
    │   ├── data/              # questions.js (+ .hi.js), plants.js, scene/animation config
    │   ├── i18n/              # English/Hindi UI text and language switching
    │   ├── services/
    │   │   ├── gameEngine.js  # Scoring, progress and refresh-resume (in the browser)
    │   │   └── googleSheets.js# Calls the Apps Script web app
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

---

## 2. Prerequisites

- **Node.js** 18+ and npm (only needed to run or build the game — the
  hosted website doesn't need Node)
- A Google Sheet with the Apps Script from `google-apps-script/` deployed
  as a web app (see `google-apps-script/DEPLOYMENT.md`)

---

## 3. Quick start (Windows)

1. Double-click **`setup.bat`**. It creates `frontend/.env` and installs
   the packages.
2. Open `frontend/.env` and set `VITE_GOOGLE_APPS_SCRIPT_URL` to your
   Apps Script web app URL (it ends in `/exec`).
3. Double-click **`start.bat`**. The game opens at http://localhost:5173.

Manual equivalent (any OS):

```bash
cd frontend
cp .env.example .env   # then set VITE_GOOGLE_APPS_SCRIPT_URL
npm install
npm run dev            # http://localhost:5173
```

---

## 4. Environment variables

**`frontend/.env`**
```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

This value is baked into the website when it is built, so rebuild after
changing it.

---

## 5. Building and hosting

1. Double-click **`build.bat`** (or run `npm run build` in `frontend/`).
2. Upload **the contents** of `frontend/dist/` (`index.html`, `assets/`,
   `audio/`, `bike-assets/`, …) to the web root of your site — for
   Hostinger, `public_html`.

Asset paths start with `/` (e.g. `/audio/...`), so host the game at the
root of a domain or subdomain (e.g. `https://game.example.com/`), not in a
sub-folder.

---

## 6. Game flow

Name/Email → Employee ID/Plant → Language (English/Hindi) → Instructions
→ 3-2-1-GO countdown → 10 rainy-road scenarios (each: situation →
decision → instant feedback) → animated final scoreboard → optional
"Review Your Decisions" → Play Again / Finish.

- **Registration**: saved to Google Sheets as a new row with a unique
  Session ID. That ID is also the game's session ID.
- **Scoring**: 10 points per correct answer, max 100, calculated by
  `frontend/src/services/gameEngine.js` against `correctAnswer` in
  `frontend/src/data/questions.js`.
- **Answer order**: the A/B/C/D positions are shuffled for every
  scenario, so the correct answer isn't always in the same place.
- **Duplicate protection**: answer buttons lock as soon as one is clicked,
  and the engine refuses to score the same scenario twice in one game.
- **Refresh protection**: progress is kept in the browser's
  `sessionStorage`, so a refresh resumes the same game. Closing the tab
  ends it.
- **Saving the result**: Finish / Play Again sends the player's 10 chosen
  options to the Apps Script, which **recalculates the score with its own
  answer key** (`ANSWER_KEY` in `Code.gs`) before writing it — so a score
  can't be faked from the browser. The same row gets the language, play
  time and one `Q1`–`Q10` cell per scenario (`Correct`, `Wrong (A)` or
  `Not answered`; the letter is the option's position in `questions.js`,
  not the shuffled on-screen letter).

---

## 7. Google Sheet columns

`Session ID | Name | Email | Employee ID | Plant | Language | Start Date |
Start Time | Final Score | Correct Answers | Wrong Answers | Completion Date |
Completion Time | Status | Game Duration (hh:mm:ss) | Q1 Answer … Q10 Answer`

Rows stay `In Progress` until the player presses Finish or Play Again.

---

## 8. Customizing the game

- **Plants dropdown** — edit `frontend/src/data/plants.js`.
- **Scenarios/questions** — edit `frontend/src/data/questions.js` and the
  Hindi copy `frontend/src/data/questions.hi.js` (same option order). If
  you change a correct answer or reorder options, also update
  `ANSWER_KEY` in `google-apps-script/Code.gs` and redeploy the script.
- **Audio** — sound effects are in `frontend/src/assets/audio/`,
  narration in `frontend/public/audio/narration/{en,hi}/`. Replace files
  using the same names.
- **Visuals** — see `ASSETS.md`.

---

## 9. Troubleshooting

- **"Google Sheets registration is not configured"** — `frontend/.env` is
  missing `VITE_GOOGLE_APPS_SCRIPT_URL`, or it doesn't end in `/exec`.
  Restart `start.bat` (or rebuild) after changing it.
- **"Google Sheets returned an invalid response"** — the Apps Script
  deployment isn't accessible. Check it is deployed as a web app with
  access set to **Anyone**, and that you're using the `/exec` URL.
- **"answers must be a list of 10 entries"** when finishing — the Apps
  Script is newer or older than the website. Deploy the current `Code.gs`
  and rebuild the website so both match.
- **"GameData headers must be: …"** — row 1 of the `GameData` tab doesn't
  match the expected columns (section 7).
- **"Game session not found. Please register again."** — the browser's
  session storage was cleared (e.g. a new tab or private window). Register
  again to start a new game.

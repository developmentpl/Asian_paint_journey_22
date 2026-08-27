-- =========================================================
-- Road Safety in Rain — Interactive Two-Wheeler Safety Game
-- Complete MySQL setup script
-- =========================================================
-- Usage (Windows / any OS with MySQL client on PATH):
--   mysql -u root -p < database.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS road_safety_game
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE road_safety_game;

-- ---------------------------------------------------------
-- players
-- Anonymous game identities used by session/answer foreign keys.
-- Registration PII is stored in Google Sheets through Apps Script.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS players (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(180)  NOT NULL,
  employee_id   VARCHAR(60)   NOT NULL,
  plant         VARCHAR(120)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_players_email (email),
  INDEX idx_players_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- questions (optional persisted copy of the scenario bank;
-- the app ships with the same data in backend/data/questions.js
-- so the game works out of the box. This table lets scenarios
-- be migrated into the DB later without any code changes,
-- since gameController can be pointed at it.)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
  id                    INT PRIMARY KEY,
  scenario_title        VARCHAR(150) NOT NULL,
  scenario_description  TEXT         NOT NULL,
  question              VARCHAR(255) NOT NULL,
  option_a              VARCHAR(255) NOT NULL,
  option_b              VARCHAR(255) NOT NULL,
  option_c              VARCHAR(255) NOT NULL,
  option_d              VARCHAR(255) NOT NULL,
  correct_option         TINYINT      NOT NULL, -- 0=A,1=B,2=C,3=D
  explanation            TEXT         NOT NULL,
  environment            VARCHAR(60)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- game_sessions
-- One row per play-through ("journey").
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_sessions (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  player_id         INT NOT NULL,
  score             INT NOT NULL DEFAULT 0,
  correct_answers   INT NOT NULL DEFAULT 0,
  wrong_answers     INT NOT NULL DEFAULT 0,
  total_questions   INT NOT NULL DEFAULT 10,
  started_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at      DATETIME NULL,
  status             ENUM('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS',
  CONSTRAINT fk_sessions_player
    FOREIGN KEY (player_id) REFERENCES players(id)
    ON DELETE CASCADE,
  INDEX idx_sessions_player (player_id),
  INDEX idx_sessions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- player_answers
-- One row per answered scenario, saved immediately.
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS player_answers (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  session_id        INT NOT NULL,
  player_id         INT NOT NULL,
  question_id       INT NOT NULL,
  selected_answer    TINYINT NOT NULL,   -- 0-3 index chosen by player
  correct_answer     TINYINT NOT NULL,   -- 0-3 index that was correct
  is_correct         TINYINT(1) NOT NULL,
  points_awarded     INT NOT NULL DEFAULT 0,
  answered_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_answers_session
    FOREIGN KEY (session_id) REFERENCES game_sessions(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_answers_player
    FOREIGN KEY (player_id) REFERENCES players(id)
    ON DELETE CASCADE,
  UNIQUE KEY uq_session_question (session_id, question_id), -- prevents duplicate/duplicate-scoring answers
  INDEX idx_answers_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- Seed the questions table with the same 10 scenarios that
-- ship in backend/data/questions.js (kept here for reference /
-- for anyone who migrates the app to read from MySQL).
-- =========================================================
INSERT INTO questions
  (id, scenario_title, scenario_description, question, option_a, option_b, option_c, option_d, correct_option, explanation, environment)
VALUES
(1, 'Preparing Before the Ride',
 'Dark clouds are gathering over the highway. Rain is expected any minute and the rider is about to start the journey.',
 'What should the rider do before setting off in expected rain?',
 'Start immediately, deal with rain gear later',
 'Wear a helmet, raincoat and check tyre grip & headlight before riding',
 'Wait for rain to fully stop, even if it takes hours, without any preparation',
 'Remove the helmet since raincoats are enough protection',
 1, 'Wearing a helmet and proper rain gear, and checking tyres and headlights beforehand, ensures the rider is visible and in control once the rain starts.', 'pre-ride'),

(2, 'Heavy Rain Reduces Visibility',
 'Heavy rain suddenly begins. Visibility drops sharply and the road ahead is barely visible through the downpour.',
 'What should the rider do when heavy rain significantly reduces visibility?',
 'Increase speed to get out of the rain faster',
 'Reduce speed and maintain a safe following distance',
 'Ride close behind another vehicle to use its tail lights as a guide',
 'Switch off the headlight to avoid glare',
 1, 'Reducing speed and increasing the following distance gives the rider more time to react to hazards that are harder to see in heavy rain.', 'heavy-rain'),

(3, 'Maintaining Safe Speed',
 'The rain has soaked the road surface completely. The rider notices the tyres feel less responsive than usual.',
 'How should the rider manage speed on a wet road?',
 'Maintain normal dry-weather speed',
 'Ride significantly slower than usual to allow for reduced tyre grip',
 'Speed up on straight stretches and slow down only at turns',
 'Match the speed of the fastest vehicle on the road',
 1, 'Wet roads drastically reduce tyre grip. Riding slower than normal compensates for the loss of traction and shortens stopping distance.', 'wet-road'),

(4, 'Safe Following Distance',
 'Traffic ahead is moving steadily, but the road is slick with rainwater and spray from vehicle tyres.',
 'What following distance should the rider keep from the vehicle ahead in the rain?',
 'The same distance as in dry weather',
 'A much longer distance than usual, since braking takes more time on wet roads',
 'As close as possible to save time',
 'No specific distance is necessary if visibility is fine',
 1, 'Braking distances increase significantly on wet roads, so a longer following distance gives the rider enough time and space to stop safely.', 'traffic'),

(5, 'Sudden Braking Ahead',
 'The car ahead suddenly hits its brakes, its brake lights flashing red through the rain and spray.',
 'What is the safest way for the rider to respond?',
 'Slam the front brake hard immediately',
 'Apply both brakes gently and progressively while staying in control',
 'Swerve without checking surroundings',
 'Ignore it and maintain the same speed',
 1, 'Gentle, progressive braking using both brakes avoids wheel lock-up and skidding, which is especially dangerous on a wet, slippery surface.', 'braking'),

(6, 'Waterlogged Road',
 'The road ahead disappears under a wide stretch of standing water from the heavy rain — a waterlogged patch across both lanes.',
 'How should the rider cross a waterlogged stretch of road?',
 'Ride through at full speed to avoid the engine stalling',
 'Slow down, ride through the shallowest, most visible part at a steady low speed',
 'Stop in the middle of the water and wait',
 'Take a sharp U-turn without checking traffic behind',
 1, 'Riding slowly and steadily through the shallowest visible section reduces the risk of losing control, stalling the engine, or hitting a hidden hazard.', 'waterlogged'),

(7, 'Pothole Filled With Water',
 'A water-filled patch ahead is hiding something beneath the surface — it could be a deep pothole, invisible under the murky rainwater.',
 'What should the rider do about a water-filled patch that may hide a pothole?',
 'Ride straight through it without slowing down',
 'Slow down and steer around it if safe, treating it as a possible pothole',
 'Accelerate to jump over it',
 'Close the eyes and hope for the best',
 1, 'Water hides the true depth of potholes. Slowing down and safely steering around the patch avoids sudden jolts, loss of control, or tyre damage.', 'pothole'),

(8, 'Pedestrian Crossing in the Rain',
 'Up ahead, a pedestrian crossing is visible. A few people are hurrying across, holding umbrellas, hard to see clearly through the rain.',
 'What should the rider do near a pedestrian crossing in the rain?',
 'Speed up to pass before pedestrians reach the crossing',
 'Slow down, stay alert and be ready to stop for pedestrians',
 'Honk continuously and proceed without slowing down',
 'Ignore the crossing since visibility is poor anyway',
 1, 'Rain reduces visibility for both riders and pedestrians. Slowing down and staying alert near crossings helps prevent accidents.', 'pedestrian'),

(9, 'Turning on a Slippery Road',
 'The road curves ahead, glistening with rainwater. A sharp turn is coming up on the wet, slippery surface.',
 'How should the rider handle a turn on a wet, slippery road?',
 'Lean sharply and take the turn at normal speed',
 'Slow down before the turn and take it gently with minimal lean',
 'Accelerate through the turn to maintain balance',
 'Brake hard while mid-turn',
 1, 'Slowing down before the turn and leaning gently reduces the chance of the tyres losing grip on the wet surface, preventing skids.', 'turn'),

(10, 'Safely Reaching the Destination',
 'The destination is finally in sight through the rain. The rider is tired, but the streetlights ahead mark the last stretch of the journey.',
 'As the rider nears the destination in fading light and rain, what is the safest approach?',
 'Rush the last stretch since the journey is almost over',
 'Continue riding cautiously with headlight on, maintaining safe speed until fully parked',
 'Remove the raincoat early to feel more comfortable while still riding',
 'Stop paying attention since the destination is close',
 1, 'Safety awareness must continue until the ride is completely finished — most accidents happen when riders relax too early near the end of a journey.', 'night-arrival')
ON DUPLICATE KEY UPDATE
  scenario_title = VALUES(scenario_title);

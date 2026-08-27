/**
 * shuffleIndices — returns a random permutation of [0..n-1], used to
 * randomize the ON-SCREEN ORDER (the A/B/C/D positions) that a
 * scenario's options are displayed in.
 *
 * IMPORTANT: this only ever reshuffles the *display* order. Each option's
 * real identity is its canonical index into the scenario's `options`
 * array (0-3) — that's what gets sent to the backend when the player
 * picks an answer, and it's exactly what backend/data/questions.js's
 * `correctAnswer` already refers to. So shuffling here needs zero backend
 * changes: the server was always validating by option identity, never by
 * displayed letter.
 */
export function shuffleIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default shuffleIndices;

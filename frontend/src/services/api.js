import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Unwraps axios errors into a friendly message string.
function errMessage(err) {
  return err?.response?.data?.message || err.message || "Something went wrong. Please try again.";
}

export const PlayerAPI = {
  createAnonymous: async () => {
    try {
      const { data } = await api.post("/players", {});
      return data.player;
    } catch (err) {
      throw new Error(errMessage(err));
    }
  },
};

export const GameAPI = {
  start: async (playerId) => {
    try {
      const { data } = await api.post("/game/start", { playerId });
      return data;
    } catch (err) {
      throw new Error(errMessage(err));
    }
  },

  getSession: async (sessionId) => {
    try {
      const { data } = await api.get(`/game/${sessionId}`);
      return data;
    } catch (err) {
      throw new Error(errMessage(err));
    }
  },

  submitAnswer: async ({ sessionId, questionId, selectedAnswer }) => {
    try {
      const { data } = await api.post("/game/answer", { sessionId, questionId, selectedAnswer });
      return data;
    } catch (err) {
      // Surface "already answered" (409) responses instead of throwing,
      // so the UI can gracefully move on rather than showing a hard error.
      if (err?.response?.status === 409 && err.response.data) {
        return err.response.data;
      }
      throw new Error(errMessage(err));
    }
  },

  complete: async (sessionId) => {
    try {
      const { data } = await api.post("/game/complete", { sessionId });
      return data;
    } catch (err) {
      throw new Error(errMessage(err));
    }
  },

  getResults: async (sessionId) => {
    try {
      const { data } = await api.get(`/game/${sessionId}/results`);
      return data;
    } catch (err) {
      throw new Error(errMessage(err));
    }
  },
};

export default api;

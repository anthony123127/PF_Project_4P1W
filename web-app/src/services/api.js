import axios from 'axios';

const authBaseUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5226/api/auth';
const resourceBaseUrl = import.meta.env.VITE_RESOURCE_API_URL || 'http://localhost:5022';

export const authApiUrl = authBaseUrl;

const createAuthorizedConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const gameApi = {
  async getPacks(random = true) {
    const response = await axios.get(`${resourceBaseUrl}/packs`, {
      ...createAuthorizedConfig(),
      params: { random }
    });
    return response.data;
  },

  async getNextPuzzle(packId) {
    const response = await axios.get(`${resourceBaseUrl}/puzzles/next`, {
      ...createAuthorizedConfig(),
      params: { packId }
    });
    return response.data;
  },

  async submitGuess(puzzleId, guess) {
    const response = await axios.post(
      `${resourceBaseUrl}/game/submit`,
      { puzzleId, guess },
      createAuthorizedConfig()
    );
    return response.data;
  },

  async getProgress() {
    const response = await axios.get(`${resourceBaseUrl}/profile/progress`, createAuthorizedConfig());
    return response.data;
  },

  async restartPack(packId) {
    await axios.post(`${resourceBaseUrl}/packs/${packId}/restart`, {}, createAuthorizedConfig());
  }
};

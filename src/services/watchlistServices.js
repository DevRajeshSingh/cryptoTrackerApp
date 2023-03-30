import axios from "axios";

const AppURL = "https://cryptocorn-backend-server.onrender.com/api/v1";

export const createWatchlist = async (id, body, token) => {
  const response = await axios.post(`${AppURL}/watchlist/${id}`, body, {
    headers: {
      token: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWatchlist = async (id, token) => {
  const response = await axios.get(`${AppURL}/watchlist/${id}`, {
    headers: {
      token: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateWatchlist = async (id, body, token) => {
  const response = await axios.put(`${AppURL}/watchlist/${id}`, body, {
    headers: {
      token: `Bearer ${token}`,
    },
  });
  return response.data;
};

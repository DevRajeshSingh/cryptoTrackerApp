import axios from "axios";

const AppURL = "https://cryptocorn-backend-server.onrender.com/api/v1";

export const createPortfolio = async (id, body, token) => {
  let response;
  try {
    response = await axios.post(`${AppURL}/portfolio/${id}`, body, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
};

export const getPortfolio = async (id, token) => {
  let response;
  try {
    response = await axios.get(`${AppURL}/portfolio/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
};

export const deletePortfolio = async (id, body, token) => {
  let response;
  try {
    response = await axios.delete(`${AppURL}/portfolio/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
      data: body,
    });

    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
};

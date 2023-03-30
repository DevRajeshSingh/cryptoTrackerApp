import axios from "axios";

const AppURL = "https://cryptocorn-backend-server.onrender.com/api/v1";

export const loginRequest = async (user) => {
  let response;
  try {
    response = await axios.post(`${AppURL}/auth/signin`, user);
    return response;
  } catch (e) {
    return e.response ;
  }
};

export const registerRequest = async (user) => {
  let response;
  try {
    response = await axios.post(`${AppURL}/auth/signup`, user);
    return response;
  } catch (e) {
    return e.response;
  }
};

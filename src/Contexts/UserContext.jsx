import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { loginRequest, registerRequest } from "./../services/authServices";
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    name: "Login",
    email: "to see your profile",
  });

  const login = async (data) => {
    const res = await loginRequest(data);
    if (res && res.status === 200) {
      await SecureStore.setItemAsync(
        "secureUser",
        JSON.stringify(res.data)
      ).then(() => {
        setUser({
          id: res.data._id,
          name: res.data.username,
          email: res.data.email,
        });
      });
    }
    return res;
  };

  const register = async (data) => {
    const res = await registerRequest(data);
    return res;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("secureUser").then(() => {
      setUser({
        name: "Login",
        email: "to see your profile",
      });
      return true;
    });
    return false;
  };

  const getValueForUser = async () => {
    let result;
    try {
      result = await SecureStore.getItemAsync("secureUser");
    } catch (e) {
      result = null;
    }
    if (result) {
      let storedUser = JSON.parse(result);
      setUser({
        name: storedUser.username,
        email: storedUser.email,
      });
      return result;
    } else {
      return result;
    }
  };

  useEffect(() => {
    getValueForUser();
  }, []);
  return (
    <UserContext.Provider
      value={{
        user,
        logout,
        login,
        register,
        getValueForUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

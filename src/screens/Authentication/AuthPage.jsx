import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "./../../Contexts/UserContext";
import { useWatchlist } from "./../../Contexts/WatchlistContext";
import From from "./components/Form";
const AuthPage = () => {
  const { login, register } = useUser();
  const { createWatchListAccount } = useWatchlist();
  const navigation = useNavigation();
  const [authType, setAuthType] = useState("login");
  const [response, setResponse] = useState({ message: "", color: "#ffffff" });
  const [loading, setLoading] = useState(false);

  const ValidateEmail = (email_id) => {
    "worklet";
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email_id.match(mailformat)) {
      return true;
    } else {
      return false;
    }
  };

  const handleAuthenticaion = async (name, email, password) => {
    if (name.length < 3 && authType === "register") {
      setResponse({
        message: "Name should be atleast 3 characters",
        color: "red",
      });
      return;
    }
    if (!ValidateEmail(email)) {
      setResponse({ message: "Email is not valid", color: "red" });
      return;
    }
    if (password.length < 6) {
      setResponse({
        message: "Password should be atleast 6 characters",
        color: "red",
      });
      return;
    }

    if (authType === "login") {
      setLoading(true);
      const response = await login({
        email: email,
        password: password,
      });
      await createWatchListAccount();
      setLoading(false);
      if (response && response.status === 200) {
        navigation.navigate("Root");
      } else {
        setResponse({ message: response.data, color: "red" });
      }
    }
    if (authType === "register") {
      setLoading(true);
      const response = await register({
        username: name,
        email: email,
        password: password,
      });
      setLoading(false);
      if (response && response.status === 200) {
        setResponse({
          message: "Registered Successfully",
          color: "green",
        });
        setAuthType("login");
      } else {
        setResponse({ message: response.data, color: "red" });
      }
    }
  };
  return (
    <From
      authType={authType}
      response={response}
      loading={loading}
      navigation={navigation}
      setAuthType={setAuthType}
      setResponse={setResponse}
      handleAuthenticaion={handleAuthenticaion}
    />
  );
};

export default AuthPage;

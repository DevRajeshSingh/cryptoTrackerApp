import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";

export default function Form({
  authType,
  loading,
  response,
  setAuthType,
  navigation,
  handleAuthenticaion,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  return (
    <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Welcome to CryptoCorn
          </Text>
          <Image
            source={require("./../../../../assets/icon.png")}
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              borderRadius: 10,
              overflow: "hidden",
              padding: 10,
              margin: 10,
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "column",
          }}
        >
          {authType === "register" && (
            <View>
              <Text style={styles.inputHeadingText}> Name</Text>

              <TextInput
                style={styles.input}
                onChangeText={(e) => {
                  setName(e);
                }}
                placeholder="Enter your name"
                placeholderTextColor="grey"
                value={name}
              />
            </View>
          )}

          <View>
            <Text style={styles.inputHeadingText}>Email</Text>
            <TextInput
              style={{
                ...styles.input,
              }}
              placeholderTextColor="grey"
              onChangeText={(e) => {
                setEmail(e);
              }}
              placeholder="Enter your Email"
              value={email}
            />
          </View>

          <View>
            <Text style={styles.inputHeadingText}>Password</Text>
            <TextInput
              style={{
                ...styles.input,
              }}
              placeholderTextColor="grey"
              onChangeText={(e) => {
                setPassword(e);
              }}
              placeholder="Enter your Password"
              value={password}
              secureTextEntry={true}
            />
          </View>

          <Text style={{ color: response.color, textAlign: "center" }}>
            {response.message}
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => {
              handleAuthenticaion(name ,email, password);
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={"#ffffff"} />
            ) : (
              <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
                {authType === "login" ? "Login" : "Register"}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.formChangeText}
            onPress={() => {
              setAuthType(authType === "login" ? "register" : "login");
            }}
            disabled={loading}
          >
            <Text style={{ color: "white", fontSize: 17, color: "#2e94b0" }}>
              {authType === "login"
                ? "Create new account "
                : "Login to your account "}
            </Text>
          </Pressable>
          
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {  
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#444444",
    borderRadius: 5,
    backgroundColor: "#1e1e1e",
    color: "white",
    height: 40,
    marginBottom: 12,
    marginTop: 5,
    marginHorizontal: 12,
    color: "#fff",
  },
  inputHeadingText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    overflow: "hidden",
    paddingRight: 30,
    marginHorizontal: 12,
  },
  button: {
    borderRadius: 5,
    margin: 12,
    backgroundColor: "#2e94b0",
    padding: 10,
    alignItems: "center",
  },
  formChangeText: {
    width: "100%",
    padding: 10,
    paddingTop: 5,
    alignItems: "center",
  },
});

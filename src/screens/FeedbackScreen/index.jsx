import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Feedback() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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

  const handleContactSubmit = async () => {
    console.log("handleContactSubmit");
    if (name.length < 3) {
      setResponse({
        message: "Please enter valid name",
        color: "red",
      });

      return;
    }
    if (message.length < 3) {
      setResponse({
        message: "Please enter valid message",
        color: "red",
      });

      return;
    }

    if (!ValidateEmail(email)) {
      setResponse({
        message: "Please enter valid email",
        color: "red",
      });
      return;
    }

    const data = {
      name: name,
      email: email,
      website: "crypto app",
      message: message,
    };

    setLoading(true);
    try {
      const res = await fetch(
        "https://contact-server-service.onrender.com/api/v1/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.status === 200) {
        setName("");
        setEmail("");
        setMessage("");
        setResponse({
          message: "Feedback sent successfully",
          color: "green",
        });
      } else {
        setResponse({
          message: "Something went wrong",
          color: "red",
        });
      }
    } catch (error) {
      setResponse({
        message: "Something went wrong",
        color: "red",
      });
    }

    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#121212",
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Ionicons
          name="chevron-back-sharp"
          size={30}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text
          style={{
            fontSize: 24,
            color: "#fff",
            fontWeight: "bold",
            overflow: "hidden",
            paddingRight: 30,
          }}
        >
          App Feedback
        </Text>
        <View></View>
      </View>
      <View
        style={{
          width: "100%",
          marginTop: 20,
        }}
      >
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
        <Text style={styles.inputHeadingText}> Feedback</Text>
        <TextInput
          editable
          multiline={true}
          maxLength={500}
          numberOfLines={8}
          placeholderTextColor="grey"
          placeholder="Enter your feedback"
          onChangeText={(e) => setMessage(e)}
          value={message}
          style={{ ...styles.input, height: 150, textAlignVertical: "top" }}
        />

        <Text style={{ color: response.color, textAlign: "center" }}>
          {response.message}
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleContactSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={"#ffffff"} />
          ) : (
            <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
              Submit
            </Text>
          )}
        </Pressable>
      </View>
    </View>
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
    alignItems: "center",
    margin: 12,
    backgroundColor: "#2e94b0",
    padding: 10,
  },
});

import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../Contexts/UserContext";

export default function User() {
  const { user, logout } = useUser();
  const navigation = useNavigation();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        width: "100%",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#282828",
          width: "100%",
          padding: 10,
        }}
      >
        <Image
          source={require("./../../../assets/user.png")}
          style={{ width: 50, height: 50, borderRadius: 24, marginRight: 10 }}
        />
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
              fontWeight: "bold",
              overflow: "hidden",
            }}
          >
            {user.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: "grey",
              fontWeight: "bold",
            }}
          >
            {user.email}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          width: "100%",
          padding: 10,
        }}
      >
        <Pressable
          style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
          onPress={() => {
            navigation.navigate("FeedbackScreen");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <MaterialIcons name="feedback" size={24} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                marginLeft: 10,
                fontWeight: "600",
              }}
            >
              Feedback
            </Text>
          </View>
          <Ionicons name="chevron-forward-sharp" size={24} color="white" />
        </Pressable>
      </View>

      <Pressable
        style={{
          backgroundColor: "#2e94b0",
          padding: 10,
          alignItems: "center",
          marginBottom: 10,
          marginHorizontal: 10,
          borderRadius: 5,
          width: "95%",
        }}
        onPress={() => {
          if (logout()) {
            navigation.replace("SplashScreen");
          }
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 17,
            fontWeight: "600",
          }}
        >
          Logout
        </Text>
      </Pressable>
      <Text style={{ color: "lightgrey", fontSize: 12, paddingHorizontal: 10 }}>
        Powered by CoinGecko
      </Text>
    </View>
  );
}

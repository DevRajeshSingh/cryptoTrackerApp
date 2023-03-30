
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/navigation.jsx";
import WatchlistProvider from "./src/Contexts/WatchlistContext";
import PortfolioProvider from "./src/Contexts/PortfolioContext";
import UserProvider from "./src/Contexts/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          colors: {
            background: "#121212",
          },
        }}
      >
       
          <PortfolioProvider>
            <WatchlistProvider>
              <UserProvider>
                <View style={styles.container}>
                  <Navigation />
                  <StatusBar style="light" />
                </View>
              </UserProvider>
            </WatchlistProvider>
          </PortfolioProvider>
      
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
  },
});

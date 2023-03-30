import React, { Suspense } from "react";
import { View, Text } from "react-native";
import PortfolioAssetsList from "./components/PortfolioAssetsList";

const PortfolioScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Suspense
        fallback={
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Loading Please Wait!
          </Text> 
        }
      >
        <PortfolioAssetsList />
      </Suspense>
    </View>
  );
};

export default PortfolioScreen;

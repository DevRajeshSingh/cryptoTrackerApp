import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import styles from "./styles";
import { getAllCoins, getDetailedCoinData } from "../../services/requests";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import { usePortfolio } from "../../Contexts/PortfolioContext";

const AddNewAssetScreen = () => {
  const navigation = useNavigation();
  const { storePortfolioCoin } = usePortfolio();

  const [allCoins, setAllCoins] = useState([]);
  const [boughtAssetQuantity, setBoughtAssetQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const isQuantityEntered = () => boughtAssetQuantity === "";

  const fetchAllCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const allCoins = await getAllCoins();
    setAllCoins(allCoins);
    setLoading(false);
  };

  const fetchCoinInfo = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinInfo = await getDetailedCoinData(selectedCoinId);
    setSelectedCoin(coinInfo);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      fetchCoinInfo();
    }
  }, [selectedCoinId]);

  const onAddNewAsset = async () => {
    setLoading(true);

    const newAsset = {
      id: selectedCoin.id,
      unique_id: selectedCoin.id + uuid.v4(),
      name: selectedCoin.name,
      image: selectedCoin.image.small,
      ticker: selectedCoin.symbol.toUpperCase(),
      quantityBought: parseFloat(boughtAssetQuantity),
      priceBought: selectedCoin.market_data.current_price.usd,
    };
    await storePortfolioCoin(newAsset);
    setLoading(false);

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, paddingHorizontal: 10 }}
      keyboardVerticalOffset={50}
      behavior={"height"}
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
          Add New Asset
        </Text>
        <View></View>
      </View>
      <SearchableDropdown
        items={allCoins}
        onItemSelect={(item) => setSelectedCoinId(item.id)}
        containerStyle={styles.dropdownContainer}
        itemStyle={styles.item}
        itemTextStyle={{ color: "white" }}
        resetValue={false}
        placeholder={selectedCoinId || "Select a coin..."}
        placeholderTextColor="white"
        textInputProps={{
          underlineColorAndroid: "transparent",
          style: {
            padding: 12,
            borderWidth: 1.5,
            borderColor: "#444444",
            borderRadius: 5,
            backgroundColor: "#1e1e1e",
            color: "white",
          },
        }}
      />
      {selectedCoin && (
        <>
          <View style={styles.boughtQuantityContainer}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ color: "white", fontSize: 90 }}
                value={boughtAssetQuantity}
                placeholder="0"
                keyboardType="numeric"
                onChangeText={setBoughtAssetQuantity}
              />
              <Text style={styles.ticker}>
                {selectedCoin.symbol.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.pricePerCoin}>
              ${selectedCoin.market_data.current_price.usd} per coin
            </Text>
          </View>
          <Pressable
            style={{
              ...styles.buttonContainer,
              backgroundColor: isQuantityEntered() ? "#303030" : "#2e94b0",
            }}
            onPress={onAddNewAsset}
            disabled={isQuantityEntered() || loading}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: isQuantityEntered() ? "grey" : "white",
              }}
            >
              {loading ? <ActivityIndicator color="white" /> : "Add New Asset"}
            </Text>
          </Pressable>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default AddNewAssetScreen;

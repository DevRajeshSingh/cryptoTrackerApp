import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Pressable,
  Modal,
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { LineChart } from "react-native-wagmi-charts";
import CoinItem from "../../components/CoinItem";
import { getMarketData, getCoinMarketChart } from "../../services/requests";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCoinId, setModalCoinId] = useState({
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image:
      "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    current_price: 22826,
    market_cap: 439998679998,
    market_cap_rank: 1,
    fully_diluted_valuation: 479510804098,
    total_volume: 32267048366,
    high_24h: 23283,
    low_24h: 22703,
    price_change_24h: -434.51337967943255,
    price_change_percentage_24h: -1.86804,
    market_cap_change_24h: -7888631227.863953,
    market_cap_change_percentage_24h: -1.7613,
  });
  const [coinMarketData, setCoinMarketData] = useState(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const fetchCoins = async (pageNumber) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData(pageNumber);
    setCoins((existingCoins) => [...existingCoins, ...coinsData]);
    setLoading(false);
  };
  const refetchCoins = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const coinsData = await getMarketData();
    setCoins(coinsData);
    setLoading(false);
  };

  const fetchMarketCoinData = async () => {
    if (!modalCoinId.id) return;
    const fetchedCoinMarketData = await getCoinMarketChart(modalCoinId.id, 1);
    setCoinMarketData(fetchedCoinMarketData);
  };

  useEffect(() => {
    fetchMarketCoinData();
  }, [modalCoinId]);

  useEffect(() => {
    setCoins([]);
    fetchCoins(1);
  }, []);

  const chartColor =
    modalCoinId.price_change_percentage_24h > 0 ? "#16c784" : "#ea3943";

  return (
    <View>
      <FlatList
        data={coins}
        renderItem={({ item }) => (
          <CoinItem
            marketCoin={item}
            setModalVisible={setModalVisible}
            setModalCoinId={setModalCoinId}
          />
        )}
        // keyExtractor={(item) => item.market_cap_rank}
        keyExtractor={(item , index) => index.toString()}
        onEndReached={() => fetchCoins(coins.length / 50 + 1)}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            tintColor="white"
            onRefresh={refetchCoins}
          />
        }
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ ...styles.centeredView, marginTop: screenHeight / 3 }}>
          <View style={styles.modalView}>
            <View style={styles.modalHeaderNavigation}>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("CoinDetailedScreen", {
                    coinId: modalCoinId.id,
                  });
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 19,
                    letterSpacing: 1,
                    marginRight: 10,
                    borderBottomColor: "#eeeeee",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                >
                  {modalCoinId.id.toUpperCase()}{" "}
                  <FontAwesome
                    name="external-link-square"
                    size={19}
                    color="white"
                  />
                </Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="white" />
              </Pressable>
            </View>

            <View
              style={{
                width: "100%",
                marginTop: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: modalCoinId.image }}
                  style={{
                    height: 30,
                    width: 30,
                    marginRight: 5,
                    alignSelf: "center",
                  }}
                />

                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    letterSpacing: 1,
                    marginRight: 10,
                  }}
                >
                  {modalCoinId.name}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 12,
                    backgroundColor: "#585858",
                    letterSpacing: 1,
                    marginRight: 10,
                    padding: 3,
                    paddingHorizontal: 6,
                    borderRadius: 4,
                  }}
                >
                  {modalCoinId.market_cap_rank}
                </Text>
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                  backgroundColor: chartColor,
                }}
              >
                {modalCoinId.price_change_percentage_24h > 1
                  ? modalCoinId.price_change_percentage_24h.toFixed(2)
                  : modalCoinId.price_change_percentage_24h}
                %
              </Text>
            </View>
            <View
              style={{
                marginTop: 15,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                }}
              >
                ${modalCoinId.current_price}
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.descriptionDetailText}>
                  24h High {modalCoinId.high_24h}{" "}
                </Text>
                <Text style={styles.descriptionDetailText}>
                  24h Low {modalCoinId.low_24h}{" "}
                </Text>
              </View>
            </View>
            {coinMarketData && (
              <View style={styles.chartContainer}>
                <LineChart.Provider
                  data={coinMarketData.market_caps.map(
                    ([timestamp, value]) => ({
                      timestamp,
                      value,
                    })
                  )}
                >
                  <LineChart
                    height={screenHeight / 3}
                    width={screenWidth}
                    useLegacyImplementation={true}
                  >
                    <LineChart.Path color={chartColor} />
                    <LineChart.CursorCrosshair color={chartColor}>
                      <LineChart.Tooltip
                        textStyle={{
                          backgroundColor: "white",
                          borderRadius: 4,
                          color: "black",
                          fontSize: 18,
                          padding: 4,
                        }}
                      />
                    </LineChart.CursorCrosshair>
                  </LineChart>
                </LineChart.Provider>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 150,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#181818",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 5,
    width: "100%",
    height: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeaderNavigation: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
  },
  button: {
    borderRadius: 15,
    padding: 8,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#252525",
  },

  chartContainer: {
    marginTop: 20,
  },
  descriptionDetailText: {
    color: "white",
    fontSize: 14,
    borderBottomColor: "#eeeeee",
  },
});

export default HomeScreen;

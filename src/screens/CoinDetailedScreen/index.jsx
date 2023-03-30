import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from "react-native";
import CoinDetailedHeader from "./../../components/CoinDetailedHeader";
import styles from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { LineChart, CandlestickChart } from "react-native-wagmi-charts";
import { useRoute } from "@react-navigation/native";
import {
  getDetailedCoinData,
  getCoinMarketChart,
  getCandleChartData,
} from "../../services/requests";
import FilterComponent from "./components/FilterComponent";
import { MaterialIcons } from "@expo/vector-icons";

const filterDaysArray = [
  { filterDay: "1", filterText: "24h" },
  { filterDay: "7", filterText: "7d" },
  { filterDay: "30", filterText: "30d" },
  { filterDay: "365", filterText: "1y" },
  { filterDay: "max", filterText: "All" },
];

const CoinDetailedScreen = () => {
  const [coin, setCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState(null);
  const [coinCandleChartData, setCoinCandleChartData] = useState(null);
  const route = useRoute();
  const {
    params: { coinId },
  } = route;

  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState("1");
  const [isCandleChartVisible, setIsCandleChartVisible] = useState(false);

  const fetchCoinData = async () => {
    setLoading(true);
    const fetchedCoinData = await getDetailedCoinData(coinId);
    setCoin(fetchedCoinData);
    setLoading(false);
  };

  const fetchMarketCoinData = async (selectedRangeValue) => {
    const fetchedCoinMarketData = await getCoinMarketChart(
      coinId,
      selectedRangeValue
    );
    setCoinMarketData(fetchedCoinMarketData);
  };

  const fetchCandleStickChartData = async (selectedRangeValue) => {
    const fetchedSelectedCandleChartData = await getCandleChartData(
      coinId,
      selectedRangeValue
    );
    setCoinCandleChartData(fetchedSelectedCandleChartData);
  };

  useEffect(() => {
    fetchCoinData();
    fetchMarketCoinData(1);
    fetchCandleStickChartData();
  }, []);

  const onSelectedRangeChange = (selectedRangeValue) => {
    setSelectedRange(selectedRangeValue);
    fetchMarketCoinData(selectedRangeValue);
    fetchCandleStickChartData(selectedRangeValue);
  };

  const memoOnSelectedRangeChange = React.useCallback(
    (range) => onSelectedRangeChange(range),
    []
  );

  if (loading || !coin || !coinMarketData || !coinCandleChartData) {
    return <ActivityIndicator size="large" />;
  }

  const {
    id,
    image: { small },
    name,
    symbol,
    links,
    market_data: {
      market_cap_rank,
      market_cap,
      current_price,
      high_24h,
      low_24h,
      total_supply,
      total_volume,
      max_supply,
      circulating_supply,
      price_change_percentage_24h,
    },
  } = coin;

  const { prices } = coinMarketData;

  const percentageColor =
    price_change_percentage_24h < 0 ? "#ea3943" : "#16c784" || "white";
  const chartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const formatCurrency = ({ value }) => {
    "worklet";
    if (value === "") {
      if (current_price.usd < 1) {
        return `$${current_price.usd}`;
      }
      return `$${current_price.usd.toFixed(2)}`;
    }
    if (current_price.usd < 1) {
      return `$${parseFloat(value)}`;
    }
    return `$${parseFloat(value).toFixed(2)}`;
  };

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <LineChart.Provider
        data={prices.map(([timestamp, value]) => ({ timestamp, value }))}
      >
        <CoinDetailedHeader
          coinId={id}
          image={small}
          symbol={symbol}
          marketCapRank={market_cap_rank}
        />
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <LineChart.PriceText
              format={formatCurrency}
              style={styles.currentPrice}
            />
          </View>
          <View
            style={{
              backgroundColor: percentageColor,
              paddingHorizontal: 3,
              paddingVertical: 8,
              borderRadius: 5,
              flexDirection: "row",
            }}
          >
            <AntDesign
              name={price_change_percentage_24h < 0 ? "caretdown" : "caretup"}
              size={12}
              color={"white"}
              style={{ alignSelf: "center", marginRight: 5 }}
            />
            <Text style={styles.priceChange}>
              {price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </View>
        </View>
        <View style={styles.filtersContainer}>
          {filterDaysArray.map((day) => (
            <FilterComponent
              filterDay={day.filterDay}
              filterText={day.filterText}
              selectedRange={selectedRange}
              setSelectedRange={memoOnSelectedRangeChange}
              key={day.filterText}
            />
          ))}
          {isCandleChartVisible ? (
            <MaterialIcons
              name="show-chart"
              size={24}
              color="#16c784"
              onPress={() => setIsCandleChartVisible(false)}
            />
          ) : (
            <MaterialIcons
              name="waterfall-chart"
              size={24}
              color="#16c784"
              onPress={() => setIsCandleChartVisible(true)}
            />
          )}
        </View>

        {isCandleChartVisible ? (
          <CandlestickChart.Provider
            data={coinCandleChartData.map(
              ([timestamp, open, high, low, close]) => ({
                timestamp,
                open,
                high,
                low,
                close,
              })
            )}
          >
            <CandlestickChart height={screenWidth / 2} width={screenWidth}>
              <CandlestickChart.Candles />
              <CandlestickChart.Crosshair>
                <CandlestickChart.Tooltip />
              </CandlestickChart.Crosshair>
            </CandlestickChart>
            <View style={styles.candleStickDataContainer}>
              <View>
                <Text style={styles.candleStickTextLabel}>Open</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="open"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>High</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="high"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>Low</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="low"
                />
              </View>
              <View>
                <Text style={styles.candleStickTextLabel}>Close</Text>
                <CandlestickChart.PriceText
                  style={styles.candleStickText}
                  type="close"
                />
              </View>
            </View>
            <CandlestickChart.DatetimeText
              style={{ color: "white", fontWeight: "700", margin: 10 }}
            />
          </CandlestickChart.Provider>
        ) : (
          <LineChart height={screenHeight / 3} width={screenWidth}>
            <LineChart.Path color={chartColor} />
            <LineChart.CursorCrosshair color={chartColor} />
          </LineChart>
        )}
      </LineChart.Provider>
      <View
        style={{
          marginVertical: 10,
          borderTopColor: "#2b2b2b",
          borderTopWidth: 1,
          borderBottomColor: "#2b2b2b",
          borderBottomWidth: 1,
          paddingVertical: 10,
        }}
      >
        <DataView label="High 24H" value={high_24h.usd} />
        <DataView label="Low  24H" value={low_24h.usd} />
        <DataView label="Market Cap" value={market_cap.usd} />
        <DataView label="Total Volume" value={total_volume.usd} />
        <DataView label="Circulating Supply" value={circulating_supply} />
        <DataView label="Max Supply" value={max_supply} />
        <DataView label="Total Supply" value={total_supply} />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#16c784",
          padding: 10,
          borderRadius: 5,
        }}
        activeOpacity={0.5}
        onPress={() => Linking.openURL(links.homepage[0])}
      >
        <Text>{links.homepage[0]}</Text>
      </TouchableOpacity>
    </View>
  );
};

const DataView = ({ label, value }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
      }}
    >
      <Text
        style={{
          color: "#dee0e0",
          fontSize: 15,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#dee0e0",
        }}
      >
        {value < 1 ? value : value.toFixed(2)}
      </Text>
    </View>
  );
};

export default CoinDetailedScreen;

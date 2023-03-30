import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  createPortfolio,
  getPortfolio,
  deletePortfolio,
} from "./../services/portfolioServices";
import { getWatchlistedCoins } from "../services/requests";

const PortfolioContext = createContext();
export const usePortfolio = () => useContext(PortfolioContext);

const PortfolioProvider = ({ children }) => {
  const [portfolioCoin, setPortfolioCoin] = useState([]);
  const [loading, setLoading] = useState(false);
  const getToken = async () => {
    try {
      result = await SecureStore.getItemAsync("secureUser");
    } catch (e) {
      result = null;
    }
    if (result) {
      let storedUser = JSON.parse(result);
      return {
        token: storedUser.accessToken,
        id: storedUser._id,
      };
    } else {
      return result;
    }
  };

  const getPortfolioData = async () => {
    const { token, id } = await getToken();
    let res;
    if (token !== null) {
      res = await getPortfolio(id, token);
    }
    if (res.data.length > 0) {
      return res.data;
    }
    return [];
  };

  const allPortfolioBoughtAssetsFromAPI = async () => {
    setLoading(true);
    const boughtPortfolioAssets = await getPortfolioData();
    const portfolioAssetsMarketData = await getWatchlistedCoins(
      1,
      boughtPortfolioAssets.map((portfolioAsset) => portfolioAsset.id).join(",")
    );
    if (
      boughtPortfolioAssets.length === 0 ||
      portfolioAssetsMarketData.length === 0
    ) {
      setLoading(false);
      return;
    }
    const boughtAssets = boughtPortfolioAssets.map((boughtAsset) => {
      const portfolioAsset = portfolioAssetsMarketData.filter(
        (item) => boughtAsset.id === item.id
      )[0];
      return {
        ...boughtAsset,
        currentPrice: portfolioAsset.current_price,
        priceChangePercentage: portfolioAsset.price_change_percentage_24h,
      };
    });

    let result = boughtAssets.sort(
      (item1, item2) =>
        item1.quantityBought * item1.currentPrice <
        item2.quantityBought * item2.currentPrice
    );
    setPortfolioCoin(result);
    setLoading(false);
  };

  const storePortfolioCoin = async (body) => {
    const { token, id } = await getToken();
    body.userId = id;
    const res = await createPortfolio(id, body, token);
    if (res.status === 200) {
      allPortfolioBoughtAssetsFromAPI();
      return true;
    }
  };

  const removePortfolioCoin = async (unique_id) => {
    setLoading(true);
    const { token, id } = await getToken();
    const res = await deletePortfolio(
      id,
      {
        unique_id: unique_id,
      },
      token
    );
    if (res.status === 200) {
      allPortfolioBoughtAssetsFromAPI();
    }
    setLoading(false);
  };

  useEffect(() => {
    allPortfolioBoughtAssetsFromAPI();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        loading,
        portfolioCoin,
        storePortfolioCoin,
        removePortfolioCoin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioProvider;

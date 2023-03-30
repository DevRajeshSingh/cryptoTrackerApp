import React, { useContext, createContext, useState, useEffect } from "react";
import {
  getWatchlist,
  updateWatchlist,
  createWatchlist,
} from "./../services/watchlistServices";
import * as SecureStore from "expo-secure-store";

const WatchlistContext = createContext();
export const useWatchlist = () => useContext(WatchlistContext);

const WatchlistProvider = ({ children }) => {
  const [watchlistCoinIds, setWatchlistCoinIds] = useState([]);

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

  const getWatchlistData = async () => {
    try {
      const { token, id } = await getToken();
      const data = await getWatchlist(id, token);
      setWatchlistCoinIds(data ? data[0].watchlistIds : []);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let token = getToken();
    if (token !== null) {
      getWatchlistData();
    }
  }, []);

  const storeWatchlistCoinId = async (coinId) => {
    try {
      const newWatchlist = [...watchlistCoinIds, coinId];
      setWatchlistCoinIds(newWatchlist);
      const { token, id } = await getToken();
      const body = {
        userId: id,
        watchlistIds: newWatchlist,
      };
      const data = await updateWatchlist(id, body, token);
    } catch (e) {
      console.log(e);
    }
  };

  const removeWatchlistCoinId = async (coinId) => {
    try {
      const newWatchlist = watchlistCoinIds.filter(
        (coinIdValue) => coinIdValue !== coinId
      );
      setWatchlistCoinIds(newWatchlist);
      const { token, id } = await getToken();
      const body = {
        userId: id,
        watchlistIds: newWatchlist,
      };
      const data = await updateWatchlist(id, body, token);
    } catch (e) {
      console.log(e);
    }
  };

  const createWatchListAccount = async () => {
    try {
      const { token, id } = await getToken();
      const body = {
        userId: id,
        watchlistIds: [],
      };
      await createWatchlist(id, body, token);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlistCoinIds,
        storeWatchlistCoinId,
        removeWatchlistCoinId,
        createWatchListAccount,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistProvider;

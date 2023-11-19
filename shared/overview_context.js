import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OverviewContext = createContext();

export const OverviewProvider = ({ children }) => {
  const [overview_data, set_overview_data] = useState({});

  const store_data = async () => {
    console.log("Storing data of ")
    try {
      await AsyncStorage.setItem("overview", JSON.stringify(overview_data));

    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const wipe_data = async () => {
    try {
      await AsyncStorage.removeItem("overview");
      set_overview_data({});
    } catch (error) {
      console.error('Error wiping data:', error);
    }

  }

  const load_data = async () => {
    console.log("RUNNING LOAD DATA")
    try {
      const value = await AsyncStorage.getItem("overview");
      if (JSON.parse(value) !== null) {
        console.log("load data", value)
        set_overview_data(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  };

  const add_overview_item = (key, value) => {
    if (!(key in overview_data)) {
      set_overview_data((prevData) => {
        return {
          ...prevData,
          [key]: value
        };
      });
      return
    }

  };

  return (
    <OverviewContext.Provider value={{ overview_data, add_overview_item, store_data, load_data, wipe_data }}>
      {children}
    </OverviewContext.Provider>
  );
};

export const useOverview = () => {
  return useContext(OverviewContext);
};

import React, { createContext, useContext, useCallback, useState } from "react";
import { get } from "../utils/api";

const CatContext = createContext();

export const CatProvider = ({ children }) => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCats = useCallback(async (location = null, count = 5) => {
    try {
      setLoading(true);
      setError(null);

      const params = location
        ? {
            lat: location.latitude,
            lng: location.longitude,
            count,
          }
        : { count };

      const response = await get("/api/cats", params);
      setCats(response.cats || []);
      return response.cats || [];
    } catch (err) {
      console.error("Failed to fetch cats:", err);
      setError("Failed to load cats. Please try again later.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCat = useCallback(async (catData) => {
    try {
      setLoading(true);
      // TODO: Implement add cat API call
      // const newCat = await post('/api/cats', catData);
      // setCats(prev => [...prev, newCat]);
      // return newCat;
    } catch (err) {
      console.error("Failed to add cat:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    cats,
    loading,
    error,
    fetchCats,
    addCat,
  };

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
};

export const useCats = () => {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCats must be used within a CatProvider");
  }
  return context;
};

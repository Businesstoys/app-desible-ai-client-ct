import { useState, useEffect } from "react";

/**
 * This hook fixes hydration when using persist to save hook data to localStorage
 */
export const useStore = (store, callback) => {
  const result = store(callback);
  const [data, setData] = useState();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

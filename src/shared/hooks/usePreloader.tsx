import React, { createContext, useContext, useState } from "react";
import Loading from "../components/Loading";

interface PreloaderContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  visitedPages: Set<string>;
  markPageAsVisited: (path: string) => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export const PreloaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());

  const markPageAsVisited = (path: string) => {
    setVisitedPages((prev) => new Set(prev).add(path));
  };

  return (
    <PreloaderContext.Provider value={{ loading, setLoading, visitedPages, markPageAsVisited }}>
      {loading && <Loading />}
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};
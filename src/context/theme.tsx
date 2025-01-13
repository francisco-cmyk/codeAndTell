import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type DarkModeContextType = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

type ProviderPops = {
  children: ReactNode;
};

export const DarkModeProvider: React.FC<ProviderPops> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.getItem("theme") === "dark") return true;
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      document.body.className = "bg-slate-950"; //TODO CHANGE
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      document.body.className = "bg-[#000F2C]"; // TODO CHANGE
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

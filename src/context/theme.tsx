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
  githubLogoMode: string;
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
  const [githubLogoMode, setGithubLogoMode] = useState(
    "public/github-logo.svg"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      setGithubLogoMode("public/github-darkMode-logo.svg");
      document.body.className = "bg-background"; //TODO CHANGE
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      setGithubLogoMode("public/github-logo.svg");
      document.body.className = "bg-slate-100"; // TODO CHANGE
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, setIsDarkMode, githubLogoMode }}
    >
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

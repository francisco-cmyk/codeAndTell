import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../config/supabaseConfig";
import useGetSession from "../hooks/useGetSession";
import useGetUser from "../hooks/useGetUser";

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  isLoginOpen: boolean;
  setIsLoginOpen: (val: boolean) => void;
};

const AuthContextProvider = createContext<AuthContextType | undefined>(
  undefined
);

type ProviderPops = {
  children: ReactNode;
};

const initialUser: User = {
  id: "",
  name: "NPC",
  avatarUrl: "public/anon-user.png",
  email: "",
};

export const AuthenticationProvider: React.FC<ProviderPops> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(initialUser);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { data: session, refetch: refetchSession } = useGetSession();
  const sessionID = session ? session.user.id : "";
  const { data: userData } = useGetUser({ sessionID });

  useEffect(() => {
    if (!session || !session?.user) {
      setIsAuthenticated(false);
      setUser(initialUser);
      return;
    }

    if (userData && session) {
      setIsAuthenticated(true);

      setUser({
        id: userData.id,
        name: userData.full_name ?? initialUser.name,
        avatarUrl: userData.avatar_url ?? "public/profile-boy-icon.png",
        email: userData.email,
      });
    }
  }, [session, userData]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, _) => {
      if (event === "INITIAL_SESSION") {
        // handle initial session
      } else if (event === "SIGNED_IN") {
        // handle sign in event
        refetchSession();
      } else if (event === "SIGNED_OUT") {
        refetchSession();
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContextProvider.Provider
      value={{ isAuthenticated, user, isLoginOpen, setIsLoginOpen }}
    >
      {children}
    </AuthContextProvider.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContextProvider);
  if (!context) {
    throw new Error("Error with Authentication Context Provider");
  }
  return context;
};

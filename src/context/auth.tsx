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
import { UserType } from "../lib/types";

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType;
  isLoginOpen: boolean;
  setIsLoginOpen: (val: boolean) => void;
};

const AuthContextProvider = createContext<AuthContextType | undefined>(
  undefined
);

type ProviderPops = {
  children: ReactNode;
};

const initialUser: UserType = {
  id: "",
  name: "",
  avatarUrl: "public/anon-user.png",
  email: "",
  preferredName: "",
  userName: "",
  bio: "",
  contactInfo: "",
  role: "",
  lastSignInAt: "",
  provider: "",
  providers: [],
  isEmailVerified: false,
  isPhoneVerified: false,
};

export const AuthenticationProvider: React.FC<ProviderPops> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType>(initialUser);
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
        ...userData,
        name: userData.name ?? userData.preferredName,
        avatarUrl: userData.avatarUrl ?? "public/profile-boy-icon.png",
      });
    }
  }, [session, userData]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
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

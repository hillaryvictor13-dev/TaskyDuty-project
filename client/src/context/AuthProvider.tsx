import { type ReactNode, useState, useEffect } from "react";
import { AuthProviderContext, type User } from ".";
import { getUserProfile } from "../api/auth";
import SuspenseUi from "../componets/SuspenseUi";



type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>(() => {
    const persistedState = localStorage.getItem("TaskDutyAuthKey");
    return persistedState ? persistedState : "";
  });

const [authenticating, setAuthenticating] = useState<boolean>(false);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("TaskDutyAuthKey", accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      setAuthenticating(true);
      const fetchUserProfile = async () => {
        try {
          const user = await getUserProfile(accessToken);
          console.log("User fetched:", user);
          setUser(user);
          setAuthenticating(false);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setAccessToken("");
          setAuthenticating(false);
        }
      };

      fetchUserProfile();
    } else {
      setUser(null);
      setAuthenticating(false);
    }
  }, [accessToken]);

if (authenticating) {
    return <SuspenseUi />;
  }

  const contextValue = { user, setUser, accessToken, setAccessToken, authenticating, setAuthenticating };

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}

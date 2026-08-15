import { createContext, useContext } from "react";

export type User = {
  id: string;
  username: string;
};

export type AuthProviderState = {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
};

const initialState: AuthProviderState = {
  user: null,
  setUser: () => {},
  accessToken: "",
  setAccessToken: () => {},
};

export const AuthProviderContext = createContext<AuthProviderState>(initialState);

export const useAuth = () => {
  const context = useContext(AuthProviderContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a provider context");
  }

  return context;
};

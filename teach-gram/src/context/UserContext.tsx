import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  phone: string;
  mail: string;
  profileLink: string;
  description: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setIsAuthenticated: (auth: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setAuthState] = useState<boolean>(false);

  const setUser = (user: User) => {
    setUserState(user);
    setAuthState(true);
  };

  const setIsAuthenticated = (auth: boolean) => {
    setAuthState(auth);
    if (!auth) setUserState(null);
  };

  const logout = () => {
    setUserState(null);
    setAuthState(false);
    // se usar localStorage/token, limpe aqui também
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setUser, setIsAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve estar dentro de <UserProvider>");
  return context;
};
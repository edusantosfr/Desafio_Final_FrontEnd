import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  bio: string;
  avatar: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  visibility: string;
  url: string;
  language: string;
}

interface UserContextType {
  user: User[];  
  repos: Repository[];  
  setUser: React.Dispatch<React.SetStateAction<User[]>>;
  setRepository: React.Dispatch<React.SetStateAction<Repository[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User[]>([]);
  const [repos, setRepository] = useState<Repository[]>([]);

  return (
    <UserContext.Provider value={{ user, setUser, repos, setRepository }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Erro");
  }
  return context;
};
import { createContext, useContext, ReactNode } from "react";
import { Role } from "../../../constants/roles";

interface AuthContextType {
  role: Role | null;
}

const AuthContext = createContext<AuthContextType>({ role: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userRole: Role = Role.USER;

  return (
    <AuthContext.Provider value={{ role: userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
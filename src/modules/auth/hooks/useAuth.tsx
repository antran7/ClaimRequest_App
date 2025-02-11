// src/modules/auth/hooks/useAuth.ts
import { createContext, useContext, ReactNode } from "react";
import { Role } from "../../../constants/roles";

interface AuthContextType {
  role: Role | null;
}

const AuthContext = createContext<AuthContextType>({ role: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userRole: Role = Role.USER; // Giả sử lấy từ API hoặc localStorage

  return (
    <AuthContext.Provider value={{ role: userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
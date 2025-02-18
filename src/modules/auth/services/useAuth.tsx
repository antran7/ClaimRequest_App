import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Role } from "../../../shared/constants/roles";

interface AuthContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSetRole = (userRole: Role) => {
    setRole(userRole);
    localStorage.setItem("userRole", userRole);
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as Role | null;
    if (savedRole) {
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole: handleSetRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
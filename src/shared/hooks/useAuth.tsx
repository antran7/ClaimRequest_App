import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { Role } from "../constants/roles";
import apiService from "../../modules/auth/services/api";

interface User {
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: async () => Promise.resolve(),
  logout: () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.get<User[]>('/user');
      const users: User[] = response.data;

      const user = users.find(
        (o) => o.email === email && o.password === password
      );

      if (user) {
        setUser(user);
        setRole(user.role as Role);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email);
      }else {
        throw new Error('Thông tin đăng nhập không chính xác');
      }
    } catch (error) {
      console.error('Error:',error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as Role | null;
    const savedEmail = localStorage.getItem("userEmail");

    if (savedRole && savedEmail) {
      setUser(user);
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
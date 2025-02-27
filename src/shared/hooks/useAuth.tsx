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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPawssword: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => Promise.resolve(),
  logout: () => { },
  forgotPawssword: () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const loginData = {
        email: email,
        password: password
      }
      const response = await apiService.post('/auth', loginData);
      if (response) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userEmail", email);
      } else {
        throw new Error('Thông tin đăng nhập không chính xác');
      }
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await apiService.post('/auth/logout');
      if (response) {
        setUser(null);
        localStorage.removeItem("token");
      } else {
        throw new Error("Log out that bai!");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const forgotPawssword = async () => {
    try {
      const email: string = localStorage.getItem("userEmail");
      const sendData = {
        email: email,
      }
      const response = await apiService.put('/auth/forgot-password', sendData);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as Role | null;
    const savedEmail = localStorage.getItem("userEmail");
    if (savedRole && savedEmail) {
      setUser(user);
    }
    setLoading(false);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPawssword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
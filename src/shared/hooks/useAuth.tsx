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
  getUserInfo: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => Promise.resolve(),
  logout: () => { },
  forgotPawssword: () => { },
  getUserInfo: () => { },
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
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await apiService.post('/auth/logout');
      if (response) {
        localStorage.removeItem("userRole");
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

  const getUserInfo = async () => {
    try {
      const response = await apiService.get('/auth');
      if (response) {
        const role = response.data.data.role_code;
        switch (role) {
          case "A001":
            localStorage.setItem("userRole", Role.ADMIN);
            break;
          case "A002":
            localStorage.setItem("userRole", Role.FINANCE);
            break;
          case "A003":
            localStorage.setItem("userRole", Role.APPROVER);
            break;
          case "A004":
            localStorage.setItem("userRole", Role.USER);
            break;
        }
      }
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
    <AuthContext.Provider value={{ user, login, logout, forgotPawssword, getUserInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
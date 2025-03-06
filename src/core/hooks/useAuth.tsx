import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { Role } from "../../shared/constants/roles";
import apiService from "../api/api";

// Tạo kiểu dữ liệu trả về
// Có các trường giống với phần data mà api response trả về
interface UserData {
  "_id": string,
    "email": string,
    "user_name": string,
    "role_code": string,
    "is_verified": boolean,
    "verification_token": string,
    "verification_token_expires": string,
    "token_version": number,
    "is_blocked": boolean,
    "created_at": string,
    "updated_at": string,
    "is_deleted": boolean,
    "__v": number
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  getUserInfo: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => Promise.resolve(),
  logout: () => { },
  forgotPassword: () => Promise.resolve(),
  getUserInfo: () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const loginData = {
        email: email,
        password: password
      }
      // Sau mỗi lệnh CRUD (get,post,put,delete) mn nhớ thêm kiểu dữ liệu trả về
      // đặt trong cặp ngoặc -> <kieu_du_lieu>
      // nếu api ko trả dữ liệu về thì ko cần thêm
      const response = await apiService.post<{ token: string }>('/auth', loginData);
      if (response.success) {
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const response = await apiService.post<null>('/auth/logout');
      if (response) {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const sendData = {
        email: email,
      }
      const response = await apiService.put<null>('/auth/forgot-password', sendData);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  const getUserInfo = async () => {
    try {
      const response = await apiService.get<UserData>('/auth');
      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await getUserInfo();
      }
      setLoading(false); 
    };
  
    fetchUser();
    console.log(user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, getUserInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
import { NavigateFunction } from "react-router-dom";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  token?: string;
}

// Lưu thông tin user vào localStorage
export const setUserToStorage = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Lấy thông tin user từ localStorage
export const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  const user = getUserFromStorage();
  return !!user && !!user.token;
};

// Lấy token của user
export const getToken = (): string | null => {
  const user = getUserFromStorage();
  return user?.token || null;
};

// Xử lý đăng xuất
export const handleLogout = (navigate: NavigateFunction): void => {
  localStorage.clear();
  navigate("/login", { replace: true });
};

// Kiểm tra role của user
export const hasRole = (requiredRole: string): boolean => {
  const user = getUserFromStorage();
  return user?.role === requiredRole;
};

// Xử lý hết hạn token
export const handleTokenExpiration = (navigate: NavigateFunction): void => {
  handleLogout(navigate);
  // Có thể thêm thông báo hoặc xử lý khác khi token hết hạn
};

// Lấy thông tin user hiện tại
export const getCurrentUser = (): User | null => {
  return getUserFromStorage();
};

// Cập nhật thông tin user trong localStorage
export const updateUserInStorage = (updatedUser: Partial<User>): void => {
  const currentUser = getUserFromStorage();
  if (currentUser) {
    const newUser = { ...currentUser, ...updatedUser };
    setUserToStorage(newUser);
  }
};

// Kiểm tra và làm mới token
export const refreshToken = async (): Promise<string | null> => {
  const user = getUserFromStorage();
  if (!user?.token) return null;

  try {
    // Thực hiện call API để refresh token
    // const response = await fetch('/api/refresh-token', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${user.token}`
    //   }
    // });
    // const data = await response.json();
    // updateUserInStorage({ token: data.newToken });
    // return data.newToken;
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Constants cho các role
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
  FINANCE: "FINANCE",
  APPROVAL: "APPROVAL",
} as const;

// Helper function để kiểm tra nhiều role
export const hasAnyRole = (requiredRoles: string[]): boolean => {
  const user = getUserFromStorage();
  if (!user?.role) return false;
  return requiredRoles.includes(user.role);
};

// Kiểm tra permissions (nếu có)
export const hasPermission = (permission: string): boolean => {
  // Implement logic kiểm tra permission tùy theo yêu cầu của ứng dụng
  console.warn("Permission logic is not yet implemented:", permission);
  return false; // Default return value if logic is not implemented
};
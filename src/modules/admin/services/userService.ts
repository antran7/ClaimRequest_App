import { User } from "../types/user";

const API_URL = "https://management-claim-request.vercel.app/api/users";

/** Hàm lấy token từ localStorage (hoặc nơi bạn lưu token) */
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/** Cấu hình headers mặc định */
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/** Lấy danh sách tất cả users */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

/** Lấy user theo ID */
export const getUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }
  return response.json();
};

/** Tạo user mới */
export const createUser = async (userData: { email: string; password: string; user_name: string; role_code: string }): Promise<User> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
};

/** Tìm kiếm users với điều kiện và phân trang */
export const searchUsers = async (searchCondition: { keyword?: string; role_code?: string; is_blocked?: boolean; is_delete?: boolean; is_verified?: boolean }, pageInfo: { pageNum: number; pageSize: number }): Promise<User[]> => {
  const response = await fetch(`${API_URL}/search`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ searchCondition, pageInfo }),
  });

  if (!response.ok) {
    throw new Error("Failed to search users");
  }
  return response.json();
};

/** Cập nhật user theo ID */
export const updateUser = async (id: string, userData: { email: string; user_name: string }): Promise<User> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

/** Xóa user theo ID */
export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

/** Đổi mật khẩu user */
export const changeUserPassword = async (id: string, newPassword: string): Promise<void> => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ id, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to change password");
  }
};

/** Đổi trạng thái user (chuyển is_blocked) */
export const changeUserStatus = async (id: string, isBlocked: boolean): Promise<void> => {
  const response = await fetch(`${API_URL}/change-status`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ id, is_blocked: isBlocked }),
  });

  if (!response.ok) {
    throw new Error("Failed to change user status");
  }
};

/** Đổi role của user */
export const changeUserRole = async (id: string, newRoleCode: "A001" | "A002" | "A003" | "A004"): Promise<void> => {
  const response = await fetch(`${API_URL}/change-role`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ id, role_code: newRoleCode }),
  });

  if (!response.ok) {
    throw new Error("Failed to change user role");
  }
};

import apiService from "../../auth/services/api"; // Import the shared API service
import { User , PageInfo , SearchResponse} from "../types/user"; // Lùi một cấp để vào thư mục types


export const searchUsers = async (
  searchCondition: object,
  pageInfo: object
): Promise<User[]> => {
  try {
    const response = await apiService.post<SearchResponse>("/users/search", {
      searchCondition,
      pageInfo,
    });

    console.log("API Response:", response.data); // ✅ Debug response

    // 🔹 Lấy danh sách user từ `pageData`
    const users = response.data?.data?.pageData ?? [];

    console.log("Parsed Users:", users); // ✅ Debug danh sách user
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Tránh lỗi khi API thất bại
  }
};



export const createUser = async (userData: Partial<User> & { password: string }): Promise<User> => {
  const response = await apiService.post<User>("/users", userData); 
  return response.data;
};

export const updateUser = async (userId: string, userData: Pick<User, "email" | "user_name">): Promise<User> => {
  const response = await apiService.put<User>(`/users/${userId}`, userData);  
  return response.data;
};


export const changeUserStatus = async (userId: string, isBlocked: boolean) => {
  return apiService.put("/users/change-status", {
    user_id: userId, // Kiểm tra API yêu cầu user_id hay id
    is_blocked: isBlocked,
  });
};

export const deleteUser = async (userId: string) => {
  return apiService.delete(`/users/${userId}`);
};


export const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiService.get<User>(`/users/${userId}`);  
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with ID: ${userId}`, error);
    throw error; 
  }
};

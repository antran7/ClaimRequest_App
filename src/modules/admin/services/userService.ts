import apiService from "../../../core/api/api";
import { User, UserResponse} from "../types/user"; 



export const searchUsers = async (
  searchCondition: object,
  pageInfo: { pageNum: number; pageSize: number }
): Promise<UserResponse> => {
  try {
    const response = await apiService.post<UserResponse>("/users/search", {
      searchCondition,
      pageInfo, 
    });

    console.log("Full API Response:", response.data); // ✅ Debug response

    return response.data; // ✅ Return the full response (not just users)
  } catch (error) {
    console.error("Error fetching users:", error);
    return { pageData: [], pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 1 } }; // ✅ Prevent errors
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

import apiService from "../../../core/api/api";
import { User, UserResponse } from "../types/user";

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
    return {
      pageData: [],
      pageInfo: { pageNum: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    }; // ✅ Prevent errors
  }
};

export const createUser = async (
  userData: Partial<User> & { password: string }
): Promise<User> => {
  const response = await apiService.post<User>("/users", userData);
  return response.data;
};

export const updateUser = async (
  userId: string,
  userData: Pick<User, "email" | "user_name">
): Promise<User> => {
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

export const changeUserRole = async (userId : string, roleCode : string) => {
  try {
    const response = await apiService.put("/users/change-role", {
      user_id: userId,
      role_code: roleCode,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update role:", error);
    return false;
  }
};

export const getEmployeeById = async (userId: string) => {
  try {
    const response = await apiService.get(`/employees/${userId}`);
    console.log("Backend API Response:", response);

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error("Employee data is empty or not found");
    } 
    return response.data; // Extract employee data from response
  } catch (error) {
    console.error(`Failed to fetch employee with ID: ${userId}`, error);
    throw error;
  }
};

export const updateEmployee = async (userId: string, employeeData: object) => {
  try {
    const response = await apiService.put(`/employees/${userId}`, employeeData);
    console.log("API Response:", response);
  } catch (error) {
    console.error("API Error:", error.response?.data || error);
    throw error;
  }
};

export const fetchJobRanks = async () => {
  try {
    const response = await apiService.get("/jobs/get-all"); 
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job ranks:", error);
    return [];
  }
};
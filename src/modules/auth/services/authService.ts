import apiService from "../../services/api";


interface User {
  email: string;
  password: string;
  role: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await apiService.get<User[]>('/user');
      const users: User[] = response.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Thông tin đăng nhập không chính xác');
      }

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};
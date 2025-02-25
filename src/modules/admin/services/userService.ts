import { User } from "../types/user";

const API_URL = "https://67aaae7465ab088ea7e73b54.mockapi.io/user";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

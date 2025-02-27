// export type User = {
//     id: string;
//     url: string;
//     name: string;
//     projectId: string[];
//   };

export interface User {
  id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  token_version: number;
}

// export type User = {
//     id: string;
//     url: string;
//     name: string;
//     projectId: string[];
//   };

export interface User {
  _id: string; // ✅ Đúng với API response
  email: string;
  user_name: string;
  role_code: string;
  is_verified?: boolean;
  is_blocked: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
  token_version?: number;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    pageData: User[]; // ✅ Chỉnh đúng theo API response
    pageInfo: PageInfo;
  };
}

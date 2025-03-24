export interface ProjectMember {
  user_id: string;
  project_role: string;
  employee_id?: string;
  user_name?: string;
  full_name?: string;
}

export interface Project {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  project_members: User[];
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
  is_deleted?: boolean;
  project_comment?: string | null;
}

export interface User {
  _id: string;
  project_role: string;
  user_name: string;
  email: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    pageData: Project[];
    pageInfo: {
      pageNum: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}

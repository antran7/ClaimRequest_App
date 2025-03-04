import { Project } from "../types/projectInterface";

const API_URL = "https://management-claim-request.vercel.app/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export const addProject = async (project: Partial<Project>): Promise<Project> => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error("Failed to add project");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const response = await fetch(`${API_URL}/projects/${project.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      throw new Error("Failed to update project");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to delete project");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch project data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const searchProject = async (searchTerm: string = "", pageNum: number = 1): Promise<ApiResponse> => {
  try {
    const bodyData = {
      searchCondition: {
        keyword: searchTerm,
        project_start_date: "",
        project_end_date: "",
        is_delete: false,
        user_id: "",
      },
      pageInfo: {
        pageNum: pageNum,
        pageSize: 10,
      },
    };

    const response = await fetch(`${API_URL}/projects/search`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error("Failed to search project");
    }

    return response.json();
  } catch (error) {
    console.error("Error searching project:", error);
    throw error;
  }
};



import { Project } from "../types/project";

const API_URL = "https://67aaae7465ab088ea7e73b54.mockapi.io/project";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addProject = async (
  project: Partial<Project>
): Promise<Project> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return response.json();
};

export const updateProject = async (project: Project): Promise<Project> => {
  const response = await fetch(`${API_URL}/${project.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return response.json();
};

export const deleteProject = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

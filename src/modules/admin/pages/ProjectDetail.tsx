import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardActions, Button } from "@mui/material";
import { fetchProjectById } from "../services/projectService";
import { Project } from "../types/project";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
        .then((data) => setProject(data))
        .catch((err) => console.error("Error fetching project:", err));
    }
  }, [projectId]);

  if (!project) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader title={project.project_name} subheader={`Mã dự án: ${project.project_code}`} />
        <CardContent>
          <p><strong>Phòng ban:</strong> {project.project_department}</p>
          <p><strong>Mô tả:</strong> {project.project_description}</p>
          <p><strong>Trạng thái:</strong> {project.project_status}</p>
          <p><strong>Ngày bắt đầu:</strong> {new Date(project.project_start_date).toLocaleDateString()}</p>
          <p><strong>Ngày kết thúc:</strong> {new Date(project.project_end_date).toLocaleDateString()}</p>
          <h2 className="text-xl font-semibold mt-6">Thành viên dự án</h2>
          <ul className="mt-2">
            {project.project_members.map((member) => (
              <li key={member.user_id} className="border-b py-2">
                <p className="font-medium">{member.user_name || "N/A"} - {member.project_role}</p>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary">Chỉnh sửa</Button>
          <Button variant="outlined" color="secondary">Xóa</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default ProjectDetail;

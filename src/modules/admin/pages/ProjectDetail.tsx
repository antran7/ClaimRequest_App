import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { fetchProjectById } from "../services/projectService";
import { Project } from "../types/project";
import Layout from "../../../shared/layouts/Layout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  deleteProject,
} from "../services/projectService";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedProjectId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProjectId) {
      try {
        await deleteProject(selectedProjectId);
        setProjects((prev) => prev.filter((p) => p.id !== selectedProjectId));
        toast.success("Project deleted successfully!");
        navigate("/admin/manageproject")
      } catch {
        toast.error("Failed to delete project");
      } finally {
        setConfirmDialogOpen(false);
        setSelectedProjectId(null);
      }
    }
  };

  return (
    <Layout>
      <button
        className="relative py-2 px-8 text-black text-base font-bold nded-full overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-gray-500 before:to-gray-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0"
        onClick={() => navigate("/admin/manageproject")}
      >
        <ArrowBackIcon />
      </button>
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader
            title={project.project_name}
            subheader={`Mã dự án: ${project.project_code}`}
          />
          <CardContent>
            <p>
              <strong>Phòng ban:</strong> {project.project_department}
            </p>
            <p>
              <strong>Mô tả:</strong> {project.project_description}
            </p>
            <p>
              <strong>Trạng thái:</strong> {project.project_status}
            </p>
            <p>
              <strong>Ngày bắt đầu:</strong>{" "}
              {new Date(project.project_start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Ngày kết thúc:</strong>{" "}
              {new Date(project.project_end_date).toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold mt-6">Thành viên dự án</h2>
            <ul className="mt-2">
              {project.project_members.map((member) => (
                <li key={member.user_id} className="border-b py-2">
                  <p className="font-medium">
                    {member.user_name || "N/A"} - {member.project_role}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
                mr: 1,
              }}
              startIcon={<EditIcon />}
              // onClick={() => handleViewProject(project.id)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleOpenConfirmDialog(project.id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </div>
      <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this project?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{ color: "gray" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
              }}
              variant="contained"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
    </Layout>
  );
};

export default ProjectDetail;

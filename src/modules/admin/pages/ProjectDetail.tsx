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
import { CircularProgress } from '@mui/material';
import { fetchProjectById } from "../services/projectService";
import { Project } from "../types/projectInterface";
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
        .then((response) => {
          if (response.success) {
            setProject(response.data);
          } else {
            toast.error("Failed to fetch project details");
          }
        })
        .catch((err) => {
          console.error("Error fetching project:", err);
          toast.error("Error loading project details");
        });
    }
  }, [projectId]);

  if (!project) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (project?._id) {
      try {
        await deleteProject(project._id);
        toast.success("Project deleted successfully!");
        navigate("/admin/manageproject");
      } catch {
        toast.error("Failed to delete project");
      } finally {
        setConfirmDialogOpen(false);
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
            subheader={`Project code: ${project.project_code}`}
          />
          <CardContent>
            <p className="mb-2">
              <strong>Department:</strong> {project.project_department}
            </p>
            <p className="mb-2">
              <strong>Description:</strong> {project.project_description}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {project.project_status}
            </p>
            <p className="mb-2">
              <strong>Start date:</strong>{" "}
              {new Date(project.project_start_date).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong>End date:</strong>{" "}
              {new Date(project.project_end_date).toLocaleDateString()}
            </p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Member</h2>
              <div className="grid gap-4">
                {project.project_members && project.project_members.length > 0 ? (
                  project.project_members.map((member) => (
                    <div key={member.user_id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="font-medium text-gray-900">
                        {member.full_name || member.user_name}
                      </p>
                      <p className="text-gray-600">
                        Role: {member.project_role}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Không có thành viên trong dự án</p>
                )}
              </div>
            </div>
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
              onClick={() => navigate(`/admin/manageproject/edit/${project._id}`)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenConfirmDialog}
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

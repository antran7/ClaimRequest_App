import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminHeaderDashboard from "../components/AdminHeaderDashboard";
import AdminSidebarDashboard from "../components/AdminSidebarDashboard";
import BackButton from "../components/BackButton";
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { Add as PlusIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import { Project } from "../types/project";
import { fetchProjects, addProject, updateProject, deleteProject } from "../services/projectService";
import { toast } from "react-hot-toast";

const ProjectManagementPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to fetch projects"));
  }, []);

  const handleOpenDialog = (project?: Project) => {
    setCurrentProject(project || { name: "", budget: 0, startDate: "", endDate: "" });
    setIsEditing(!!project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProject({ ...currentProject, [e.target.name]: e.target.value });
  };

  const handleSaveProject = async () => {
    try {
      if (isEditing && currentProject.id) {
        const updatedProject = await updateProject(currentProject as Project);
        setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
        toast.success("Project updated successfully!");
      } else {
        const newProject = await addProject(currentProject);
        setProjects([...projects, newProject]);
        toast.success("Project added successfully!");
      }
      handleCloseDialog();
    } catch {
      toast.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted successfully!");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="col-span-2 bg-white shadow-lg flex flex-col h-full">
        <AdminHeaderDashboard toggleSidebar={toggleSidebar} />
        <AdminSidebarDashboard isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="col-span-10 p-8">
        <div className="flex justify-between items-center mb-6">
          <BackButton to="/admindashboard"/>
          <Typography variant="h5" className="font-bold text-gray-800">Project Management</Typography>
          <Button variant="contained" color="primary" startIcon={<PlusIcon />} onClick={() => handleOpenDialog()}>
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="shadow-md rounded-lg overflow-hidden">
                <CardHeader title={<Typography variant="h6">{project.name}</Typography>} />
                <CardContent>
                  <Typography color="textSecondary">Budget: ${project.budget.toLocaleString()}</Typography>
                  <Typography color="textSecondary">Start Date: {new Date(project.startDate).toLocaleDateString()}</Typography>
                  <Typography color="textSecondary">End Date: {new Date(project.endDate).toLocaleDateString()}</Typography>
                  <div className="flex justify-between mt-4">
                    <Button variant="outlined" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenDialog(project)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />} onClick={() => handleDeleteProject(project.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" className="text-center col-span-3">No projects found</Typography>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Project Name" name="name" value={currentProject.name || ""} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Budget" name="budget" type="number" value={currentProject.budget || ""} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Start Date" name="startDate" type="date" value={currentProject.startDate || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="dense" label="End Date" name="endDate" type="date" value={currentProject.endDate || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSaveProject} color="primary">{isEditing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectManagementPage;
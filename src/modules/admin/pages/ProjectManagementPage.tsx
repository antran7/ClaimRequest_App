import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../../shared/components/Header";
import BackButton from "../components/BackButton";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../services/projectService";
import { fetchUsers } from "../services/userService";
import { toast } from "react-hot-toast";
import { Project } from "../types/project";
import { User } from "../types/user";

const ProjectManagementPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to fetch projects"));

    fetchUsers()
      .then(setUsers)
      .catch(() => toast.error("Failed to fetch users"));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Project name is required"),
    budget: Yup.number()
      .required("Budget is required")
      .min(0, "Budget must be a positive number"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      budget: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const projectData = {
          ...values,
          budget: Number(values.budget),
        };

        if (isEditing && editingProjectId) {
          const updatedProject = await updateProject({
            id: editingProjectId,
            ...projectData,
          });
          setProjects((prev) =>
            prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
          );
          toast.success("Project updated successfully!");
        } else {
          const newProject = await addProject(projectData);
          setProjects((prev) => [...prev, newProject]);
          toast.success("Project added successfully!");
        }
        handleCloseDialog();
      } catch {
        toast.error("Failed to save project");
      }
    },
  });

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setIsEditing(true);
      setEditingProjectId(project.id);
      formik.setValues({
        name: project.name,
        budget: project.budget.toString(),
        startDate: project.startDate,
        endDate: project.endDate,
      });
    } else {
      setIsEditing(false);
      setEditingProjectId(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted successfully!");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSideBar={toggleSidebar} />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <BackButton to="/admin/dashboard" />
          <Typography variant="h5">Project Management</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add Project
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>${project.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(project.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(project.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {users
                        .filter((user) => user.projectId.includes(project.id))
                        .map((user) => (
                          <img
                            key={user.id}
                            src={user.url}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border mr-2"
                          />
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(project)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="w-1/3 ml-auto p-4">
          <Stack spacing={2}>
            <Pagination count={10} variant="outlined" shape="rounded" />
          </Stack>
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Budget"
            {...formik.getFieldProps("budget")}
            type="number"
            error={formik.touched.budget && Boolean(formik.errors.budget)}
            helperText={formik.touched.budget && formik.errors.budget}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            {...formik.getFieldProps("startDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />

          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            {...formik.getFieldProps("endDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProjectManagementPage;

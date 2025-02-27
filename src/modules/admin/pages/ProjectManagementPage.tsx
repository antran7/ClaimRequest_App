import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Search from "../../../shared/components/searchComponent/Search";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
} from "@mui/material";
import Layout from "../../../shared/layouts/Layout";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import {
  fetchProjects,
  addProject,
  deleteProject,
} from "../services/projectService";
import { fetchUsers } from "../services/userService";
import { toast } from "react-hot-toast";
import { Project } from "../types/project";
import { User } from "../types/user";

const ProjectManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const itemPerPage = 10;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => toast.error("Failed to fetch projects"));

    fetchUsers()
      .then(setUsers)
      .catch(() => toast.error("Failed to fetch users"));
  }, []);

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Project name is required"),
    project_code: Yup.string().required("Project code is required"),
    project_department: Yup.string().required("Department is required"),
    project_description: Yup.string().required("Description is required"),
    project_start_date: Yup.date().required("Start date is required"),
    project_end_date: Yup.date()
      .required("End date is required")
      .min(Yup.ref("project_start_date"), "End date must be after start date"),
      project_members: Yup.array().of(
        Yup.object().shape({
          user_id: Yup.string(),
          project_role: Yup.string(),
          employee_id: Yup.string(),
          user_name: Yup.string(),
          full_name: Yup.string(),
        })
      ).min(1, "At least one project member is required"),
    
  });

  const formik = useFormik({
    initialValues: {
      project_name: "",
      project_code: "",
      project_department: "",
      project_description: "",
      project_start_date: new Date().toISOString().split('T')[0],
      project_end_date: new Date().toISOString().split('T')[0],
      project_members: [{
        user_id: "",
        project_role: ""
      }]
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Format dates to match the expected API format
        const projectData = {
          ...values,
          project_start_date: new Date(values.project_start_date).toISOString(),
          project_end_date: new Date(values.project_end_date).toISOString(),
        };

        const newProject = await addProject(projectData);
        setProjects((prev) => [...prev, newProject]);
        toast.success("Project added successfully!");
        handleCloseDialog();
      } catch {
        toast.error("Failed to save project");
      }
    },
  });

  const handleAddMember = () => {
    formik.setFieldValue("project_members", [
      ...formik.values.project_members,
      { user_id: "", project_role: "" }
    ]);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...formik.values.project_members];
    updatedMembers.splice(index, 1);
    formik.setFieldValue("project_members", updatedMembers);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formik.values.project_members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    formik.setFieldValue("project_members", updatedMembers);
  };

  const handleOpenDialog = () => {
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    formik.resetForm();
  };

  const handleOpenConfirmDialog = (id: string) => {
    setSelectedProjectId(id);
    setConfirmDialogOpen(true);
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/admin/manageproject/${projectId}`);
  };

  const handleConfirmDelete = async () => {
    if (selectedProjectId) {
      try {
        await deleteProject(selectedProjectId);
        setProjects((prev) => prev.filter((p) => p.id !== selectedProjectId));
        toast.success("Project deleted successfully!");
      } catch {
        toast.error("Failed to delete project");
      } finally {
        setConfirmDialogOpen(false);
        setSelectedProjectId(null);
      }
    }
  };

  const paginatedProject = projects.slice(
    (page - 1) * itemPerPage,
    page * itemPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
            <BackButton to="/admin/dashboard" />
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5">Project Management</Typography>
            <Search />
            <button
              title="Add New"
              className="group cursor-pointer outline-none hover:rotate-90 duration-300"
              onClick={handleOpenDialog}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                className="stroke-zinc-400 fill-none group-active:stroke-zinc-200 group-active:duration-0 duration-300"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  strokeWidth="1.5"
                ></path>
                <path d="M8 12H16" strokeWidth="1.5"></path>
                <path d="M12 16V8" strokeWidth="1.5"></path>
              </svg>
            </button>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-gray-500">
                  <TableCell>Project Name</TableCell>
                  <TableCell>Project Code</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  {/* <TableCell>Project Members</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProject.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.project_name}</TableCell>
                    <TableCell>{project.project_code}</TableCell>
                    <TableCell>{project.project_department}</TableCell>
                    <TableCell>{formatDate(project.project_start_date)}</TableCell>
                    <TableCell>{formatDate(project.project_end_date)}</TableCell>
                    {/* <TableCell>
                      <div className="flex flex-col">
                        {project.project_members.map((member) => (
                          <span key={member.user_id} className="mr-2">
                            {member.project_role}
                          </span>
                        ))}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "gray",
                          color: "white",
                          "&:hover": { backgroundColor: "darkgray" },
                          mr: 1,
                        }}
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewProject(project.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenConfirmDialog(project.id)}
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
              <Pagination
                count={Math.ceil(projects.length / itemPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </div>
        </div>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle className="bg-gray-500">Add Project</DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <TextField
                fullWidth
                label="Project Name"
                {...formik.getFieldProps("project_name")}
                error={formik.touched.project_name && Boolean(formik.errors.project_name)}
                helperText={formik.touched.project_name && formik.errors.project_name}
              />

              <TextField
                fullWidth
                label="Project Code"
                {...formik.getFieldProps("project_code")}
                error={formik.touched.project_code && Boolean(formik.errors.project_code)}
                helperText={formik.touched.project_code && formik.errors.project_code}
              />

              <TextField
                fullWidth
                label="Department"
                {...formik.getFieldProps("project_department")}
                error={formik.touched.project_department && Boolean(formik.errors.project_department)}
                helperText={formik.touched.project_department && formik.errors.project_department}
              />

              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...formik.getFieldProps("project_description")}
                error={formik.touched.project_description && Boolean(formik.errors.project_description)}
                helperText={formik.touched.project_description && formik.errors.project_description}
              />

              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...formik.getFieldProps("project_start_date")}
                error={formik.touched.project_start_date && Boolean(formik.errors.project_start_date)}
                helperText={formik.touched.project_start_date && formik.errors.project_start_date}
              />

              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...formik.getFieldProps("project_end_date")}
                error={formik.touched.project_end_date && Boolean(formik.errors.project_end_date)}
                helperText={formik.touched.project_end_date && formik.errors.project_end_date}
              />
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">Project Members</Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleAddMember}
                >
                  Add Member
                </Button>
              </div>
              
              {formik.values.project_members.map((member, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                  <FormControl fullWidth>
                    <InputLabel id={`user-select-label-${index}`}>User</InputLabel>
                    <Select
                      labelId={`user-select-label-${index}`}
                      value={member.user_id}
                      label="User"
                      onChange={(e) => handleMemberChange(index, "user_id", e.target.value)}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Role"
                    value={member.project_role}
                    onChange={(e) => handleMemberChange(index, "project_role", e.target.value)}
                  />
                  
                  <Button 
                    color="error" 
                    onClick={() => handleRemoveMember(index)}
                    disabled={formik.values.project_members.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              {formik.touched.project_members && typeof formik.errors.project_members === 'string' && (
                <Typography color="error">{formik.errors.project_members}</Typography>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: "gray" }}>
              Cancel
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              variant="contained"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
      </div>
    </Layout>
  );
};

export default ProjectManagementPage;
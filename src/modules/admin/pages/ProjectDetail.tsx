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
import { Project, User } from "../types/projectInterface";
import Layout from "../../../shared/layouts/Layout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { deleteProject } from "../services/projectService";
import { updateProject } from "../services/projectService";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { searchUsers } from "../services/userService";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

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

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Project name is required"),
    project_code: Yup.string().required("Project code is required"),
    project_department: Yup.string().required("Department is required"),
    project_description: Yup.string().required("Description is required"),
    project_start_date: Yup.date().required("Start date is required"),
    project_end_date: Yup.date()
      .required("End date is required")
      .min(Yup.ref("project_start_date"), "End date must be after start date"),
  });

  const formik = useFormik({
    initialValues: {
      project_name: project?.project_name || "",
      project_code: project?.project_code || "",
      project_department: project?.project_department || "",
      project_description: project?.project_description || "",
      project_start_date: project?.project_start_date
        ? project.project_start_date.split("T")[0]
        : "",
      project_end_date: project?.project_end_date
        ? project.project_end_date.split("T")[0]
        : "",
      project_members: project?.project_members || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await updateProject({
          _id: project?._id!,
          ...values,
          project_members: values.project_members, // Use the updated members
          project_status: project?.project_status || "ACTIVE",
        });
        toast.success("Project updated successfully!");
        setEditDialogOpen(false);
        if (projectId) {
          const response = await fetchProjectById(projectId);
          if (response.success) {
            setProject(response.data);
          }
        }
      } catch (error) {
        toast.error("Failed to update project");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOpenEditDialog = () => {
    fetchUsers();
    formik.resetForm({
      values: {
        project_name: project?.project_name || "",
        project_code: project?.project_code || "",
        project_department: project?.project_department || "",
        project_description: project?.project_description || "",
        project_start_date: project?.project_start_date?.split("T")[0] || "",
        project_end_date: project?.project_end_date?.split("T")[0] || "",
        project_members: project?.project_members || [],
      },
    });
    setEditDialogOpen(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await searchUsers(
        { keyword: "" },
        { pageNum: 1, pageSize: 100 }
      );
      if (response?.pageData) {
        setUsers(response.pageData);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleAddMember = () => {
    formik.setFieldValue("project_members", [
      ...formik.values.project_members,
      {
        _id: "",
        user_id: "",
        user_name: "",
        email: "",
        project_role: "",
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...formik.values.project_members];
    updatedMembers.splice(index, 1);
    formik.setFieldValue("project_members", updatedMembers);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...formik.values.project_members];
    if (field === "user_id") {
      const selectedUser = users.find((user) => user._id === value);
      updatedMembers[index] = {
        ...updatedMembers[index],
        _id: value,
        user_id: value, // Thêm user_id
        user_name: selectedUser?.user_name,
        email: selectedUser?.email,
        project_role: updatedMembers[index].project_role || "",
      };
    } else {
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      };
    }
    formik.setFieldValue("project_members", updatedMembers);
  };

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
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader
            title={project.project_name}
            subheader={`Project code: ${project.project_code}`}
            className="bg-gray-100 px-6 py-4"
          />
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Department:</strong> {project.project_department}
              </p>
              <p>
                <strong>Status:</strong> {project.project_status}
              </p>
              <p>
                <strong>Start date:</strong>{" "}
                {new Date(project.project_start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End date:</strong>{" "}
                {new Date(project.project_end_date).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-4">
              <strong>Description:</strong> {project.project_description}
            </p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Members</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {project.project_members &&
                project.project_members.length > 0 ? (
                  project.project_members.map((member) => (
                    <div
                      key={member._id}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border"
                    >
                      <p className="font-medium text-gray-900">
                        {member.user_name}
                      </p>
                      <p className="text-gray-600">
                        Role: {member.project_role}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    Không có thành viên trong dự án
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardActions className="p-6 flex justify-end gap-3">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
              }}
              startIcon={<EditIcon />}
              onClick={handleOpenEditDialog}
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
          <Typography>Are you sure you want to delete this project?</Typography>
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
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-gray-100 border-b border-gray-200 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Project</h2>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                name="project_name"
                label="Project Name"
                value={formik.values.project_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_name &&
                  Boolean(formik.errors.project_name)
                }
                helperText={
                  formik.touched.project_name && formik.errors.project_name
                }
              />
              <TextField
                fullWidth
                name="project_code"
                label="Project Code"
                value={formik.values.project_code}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_code &&
                  Boolean(formik.errors.project_code)
                }
                helperText={
                  formik.touched.project_code && formik.errors.project_code
                }
              />
              <TextField
                fullWidth
                name="project_department"
                label="Department"
                value={formik.values.project_department}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_department &&
                  Boolean(formik.errors.project_department)
                }
                helperText={
                  formik.touched.project_department &&
                  formik.errors.project_department
                }
              />
              <TextField
                fullWidth
                name="project_description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.project_description}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_description &&
                  Boolean(formik.errors.project_description)
                }
                helperText={
                  formik.touched.project_description &&
                  formik.errors.project_description
                }
              />
              <TextField
                fullWidth
                type="date"
                name="project_start_date"
                label="Start Date"
                value={formik.values.project_start_date}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_start_date &&
                  Boolean(formik.errors.project_start_date)
                }
                helperText={
                  formik.touched.project_start_date &&
                  formik.errors.project_start_date
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="date"
                name="project_end_date"
                label="End Date"
                value={formik.values.project_end_date}
                onChange={formik.handleChange}
                error={
                  formik.touched.project_end_date &&
                  Boolean(formik.errors.project_end_date)
                }
                helperText={
                  formik.touched.project_end_date &&
                  formik.errors.project_end_date
                }
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">Project Members</Typography>
                {/* <Button
                  variant="outlined"
                  color="primary"

                >
                  Add Member
                </Button> */}
                <div
                  className="group relative flex size-10 items-center justify-center gap-1 rounded-lg border border-black"
                  onClick={handleAddMember}
                >
                  <div className="size-1 rounded-full bg-black duration-300 group-hover:opacity-0"></div>
                  <div className="relative size-1 origin-center rounded-full bg-black duration-300 before:absolute before:left-1 before:h-1 before:origin-center before:rounded-full before:bg-black before:delay-300 before:duration-300 after:absolute after:left-1 after:h-1 after:origin-center after:rounded-full after:bg-black after:delay-300 after:duration-300 group-hover:w-6 group-hover:before:w-3.5 group-hover:before:-rotate-90 group-hover:after:w-3.5 group-hover:after:rotate-90"></div>

                  <div className="size-1 rounded-full bg-black duration-300 group-hover:opacity-0"></div>
                </div>
              </div>

              {formik.values.project_members.map((member, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                  <FormControl fullWidth>
                    <InputLabel id={`user-select-label-${index}`}>
                      User
                    </InputLabel>
                    <Select
                      labelId={`user-select-label-${index}`}
                      value={member.user_id || member._id || ""} // Thêm member.user_id
                      label="User"
                      onChange={(e) =>
                        handleMemberChange(index, "user_id", e.target.value)
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select User
                      </MenuItem>
                      {users.map((user) => (
                        <MenuItem
                          key={user._id}
                          value={user._id}
                          selected={
                            member.user_id === user._id ||
                            member._id === user._id
                          }
                        >
                          {user.user_name} ({user.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={member.project_role || ""}
                      label="Role"
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          "project_role",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Project Manager">
                        Project Manager
                      </MenuItem>
                      <MenuItem value="Technical Leader">
                        Technical Leader
                      </MenuItem>
                      <MenuItem value="Developer">Developer</MenuItem>
                      <MenuItem value="Tester">Tester</MenuItem>
                      <MenuItem value="Business Analytics">
                        Business Analytics
                      </MenuItem>
                      <MenuItem value="Technical Consultant">
                        Technical Consultant
                      </MenuItem>
                      <MenuItem value="Quality Analytics">
                        Quality Analytics
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    color="error"
                    onClick={() => handleRemoveMember(index)}
                    disabled={formik.values.project_members.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {formik.touched.project_members &&
                typeof formik.errors.project_members === "string" && (
                  <Typography color="error">
                    {formik.errors.project_members}
                  </Typography>
                )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditDialogOpen(false)}
              sx={{ color: "gray" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
              }}
            >
              {loading ? (
                <>
                  <div className="flex justify-center flex-row gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default ProjectDetail;

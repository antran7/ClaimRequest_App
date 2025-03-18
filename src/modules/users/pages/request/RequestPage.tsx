import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Layout from "../../../../shared/layouts/Layout";
import { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";

const API_URL = "https://management-claim-request.vercel.app/api";

const tableCellStyle = {
  borderRight: "2px solid rgba(224, 224, 224, 1)",
  borderBottom: "2px solid rgba(224, 224, 224, 1)",
  "&:last-child": {
    borderRight: "none",
  },
};

const headerCellStyle = {
  ...tableCellStyle,
  borderBottom: "2px solid rgba(180, 180, 180, 1)",
  backgroundColor: "#f3f4f6",
  fontWeight: "bold",
};

interface Request {
  _id: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  project_id: string;
  approval_id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  project_info?: {
    _id: string;
    project_name: string;
    project_code: string;
    // ... other project fields
  };
  approval_info?: {
    _id: string;
    user_name: string;
    email: string;
    // ... other approver fields
  };
}

interface Project {
  _id: string;
  project_name: string;
  project_code: string;
  project_department: string;
  project_description: string;
  project_status: string;
  project_start_date: string;
  project_end_date: string;
  project_members: {
    project_role: string;
    user_id: string;
    employee_id: string;
    user_name: string;
    full_name: string;
  }[];
}

interface Approver {
  _id: string;
  user_name: string;
}

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<{
    claim_name: string;
    project_id: string;
    approval_id: string;
    claim_start_date: moment.Moment | null;
    claim_end_date: moment.Moment | null;
    total_work_time: number;
  }>({
    claim_name: "",
    project_id: "",
    approval_id: "",
    claim_start_date: null,
    claim_end_date: null,
    total_work_time: 0,
  });
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  // useEffect hooks remain unchanged
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const tokenParts = storedToken.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("Token payload:", payload);
        if (payload.id) {
          setUserId(payload.id);
          localStorage.setItem("userId", payload.id);
          console.log("Set userId from token:", payload.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUserEmail = localStorage.getItem("userEmail");
        if (currentUserEmail) {
          setUserEmail(currentUserEmail);
          const response = await axios.get(
            `${API_URL}/users/${currentUserEmail}`
          );
          setUserId(response.data.data._id);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        console.log("Fetching requests...");
        const response = await axios.post(
          `${API_URL}/claims/claimer-search`, // Thay đổi endpoint từ /claims/search thành /claims/claimer-search
          {
            searchCondition: {
              keyword: "",
              claim_status: "",
              claim_start_date: "",
              claim_end_date: "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 10,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response received:", response.data);
        if (response.data.success) {
          setRequests(response.data.data.pageData);
        } else {
          console.error("Failed to fetch requests:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail, userId, token]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects for userId:", userId);
        const projectsResponse = await axios.post(
          `${API_URL}/projects/search`,
          {
            searchCondition: {
              keyword: "",
              project_start_date: "",
              project_end_date: "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 100,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (projectsResponse.data.success) {
          const allProjects = projectsResponse.data.data.pageData;
          console.log("All projects:", allProjects);

          const userProjects = allProjects.filter((project: Project) => {
            const isMember = project.project_members?.some(
              (member) => member.user_id === userId
            );
            console.log(
              `Project ${project.project_name} - User is member: ${isMember}`
            );
            return isMember;
          });

          console.log("Filtered user projects:", userProjects);
          setProjects(userProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [token, userId]);

  useEffect(() => {
    const storedRequests = localStorage.getItem("requests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem("requests", JSON.stringify(requests));
    }
  }, [requests]);

  const fetchApprovers = async (keyword: string) => {
    try {
      console.log("Fetching approvers...");
      const response = await axios.post(
        `${API_URL}/users/search`,
        {
          searchCondition: {
            keyword,
            role_code: "A003",
            is_delete: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 100,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Approvers response received:", response.data);
      if (response.data.success) {
        setApprovers(response.data.data.pageData);
        console.log("Approvers set:", response.data.data.pageData);
      } else {
        console.error("Failed to fetch approvers:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching approvers:", error);
    }
  };

  // Updated handleAddModalOk function
  const handleAddModalOk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleAddModalOk called with formValues:", formValues);

    // Validate required fields
    if (
      !formValues.claim_name ||
      !formValues.project_id ||
      !formValues.approval_id ||
      !formValues.claim_start_date ||
      !formValues.claim_end_date ||
      formValues.total_work_time <= 0
    ) {
      console.error(
        "All fields are required and total work time must be positive"
      );
      return;
    }

    // Validate date logic
    if (
      formValues.claim_end_date &&
      formValues.claim_start_date &&
      formValues.claim_end_date.isBefore(formValues.claim_start_date)
    ) {
      setDateError("End date cannot be before start date");
      console.error("Date validation failed:", dateError);
      return;
    }

    // Ensure userId and token are available
    if (!userId || !token) {
      console.error("Missing userId or token");
      return;
    }

    try {
      const newRequest = {
        user_id: userId, // Include user_id in the request
        project_id: formValues.project_id,
        approval_id: formValues.approval_id,
        claim_name: formValues.claim_name,
        claim_start_date: formValues.claim_start_date.toISOString(),
        claim_end_date: formValues.claim_end_date.toISOString(),
        total_work_time: Number(formValues.total_work_time), // Ensure it's a number
        claim_status: "Draft", // Default status
        remark: "",
      };

      console.log("Submitting newRequest:", newRequest);

      const response = await axios.post(`${API_URL}/claims`, newRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API response:", response.data);

      if (response.data.success) {
        const updatedRequests = [...requests, response.data.data];
        setRequests(updatedRequests);
        localStorage.setItem("requests", JSON.stringify(updatedRequests)); // Save to localStorage
        setIsAddModalVisible(false);
        setFormValues({
          claim_name: "",
          project_id: "",
          approval_id: "",
          claim_start_date: null,
          claim_end_date: null,
          total_work_time: 0,
        });
        setDateError(null);
      } else {
        console.error("Failed to add request:", response.data.message);
        alert(response.data.message); // Display error message to user
      }
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  // Other functions remain unchanged
  const handleEditModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentRequest || !token) return;

    if (
      formValues.claim_end_date &&
      formValues.claim_start_date &&
      formValues.claim_end_date.isBefore(formValues.claim_start_date)
    ) {
      setDateError("End date cannot be before start date");
      return;
    }

    try {
      const updatedRequest = {
        ...currentRequest,
        claim_name: formValues.claim_name,
        project_id: formValues.project_id,
        approval_id: formValues.approval_id,
        claim_start_date: formValues.claim_start_date
          ? formValues.claim_start_date.toISOString()
          : null,
        claim_end_date: formValues.claim_end_date
          ? formValues.claim_end_date.toISOString()
          : null,
        total_work_time: formValues.total_work_time,
      };
      await axios.put(
        `${API_URL}/claims/${currentRequest._id}`,
        updatedRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(
        requests.map((req) =>
          req._id === currentRequest._id
            ? {
                ...updatedRequest,
                claim_start_date: updatedRequest.claim_start_date || "",
                claim_end_date: updatedRequest.claim_end_date || "",
              }
            : req
        )
      );
      setIsEditModalVisible(false);
      setCurrentRequest(null);
      setDateError(null);
    } catch (error) {
      console.error("Error editing request:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setRequestToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (requestToDelete === null || !token) return;

    try {
      await axios.put(
        `${API_URL}/claims/change-status`,
        {
          claim_id: requestToDelete,
          claim_status: "Canceled",
          comment: "Canceled by user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(requests.filter((req) => req._id !== requestToDelete));
      setIsDeleteModalVisible(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleRequestApproval = async (id: string) => {
    setRequestToApprove(id);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmApproval = async () => {
    if (requestToApprove === null || !token) return;

    try {
      await axios.put(
        `${API_URL}/claims/change-status`,
        {
          claim_id: requestToApprove,
          claim_status: "Pending Approval",
          comment: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(
        requests.map((req) =>
          req._id === requestToApprove
            ? { ...req, claim_status: "Pending Approval" }
            : req
        )
      );
      setIsConfirmModalVisible(false);
      setRequestToApprove(null);
    } catch (error) {
      console.error("Error sending approval request:", error);
    }
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
    setCurrentRequest(null);
    setFormValues({
      claim_name: "",
      project_id: "",
      approval_id: "",
      claim_start_date: null,
      claim_end_date: null,
      total_work_time: 0,
    });
    setDateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name as string]: value as string });
  };

  const handleDateChange = (name: string, date: moment.Moment | null) => {
    setFormValues({ ...formValues, [name]: date });
  };

  // JSX remains unchanged
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
          <div className="request-content">
            <h1 className="request-title">Claim Request Management</h1>

            <div className="request-filters">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-field"
                placeholder="Search by name..."
              />
              <Button
                variant="contained"
                onClick={() => setIsAddModalVisible(true)}
                sx={{
                  backgroundColor: "#bcfcbc",
                  "&:hover": {
                    backgroundColor: "#81eee8",
                  },
                }}
              >
                + Add Request
              </Button>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="flex justify-center flex-row gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            ) : (
              <TableContainer
                component={Paper}
                className="request-table-container"
              >
                <Table stickyHeader aria-label="requests table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={headerCellStyle}>
                        Request Name
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Project Name
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Approver
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Start Date
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        End Date
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Total Times (Hours)
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requests
                      .filter((req) =>
                        req.claim_name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                      .map((req) => (
                        <TableRow key={req._id}>
                          <TableCell align="center" sx={tableCellStyle}>
                            {req.claim_name}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {req.project_info?.project_name ||
                              "Unknown Project"}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {req.approval_info?.user_name || "Unknown Approver"}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            <span
                              className={`status-badge status-${req.claim_status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {req.claim_status}
                            </span>
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {moment(req.claim_start_date).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {moment(req.claim_end_date).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {req.total_work_time} (hours)
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ ...tableCellStyle, minWidth: "250px" }}
                          >
                            <div className="action-buttons">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setCurrentRequest(req);
                                  setIsEditModalVisible(true);
                                  setFormValues({
                                    claim_name: req.claim_name,
                                    project_id: req.project_id,
                                    approval_id: req.approval_id,
                                    claim_start_date: moment(
                                      req.claim_start_date
                                    ),
                                    claim_end_date: moment(req.claim_end_date),
                                    total_work_time: req.total_work_time,
                                  });
                                }}
                                disabled={
                                  req.claim_status !== "Draft" &&
                                  req.claim_status !== "Returned"
                                }
                                sx={{
                                  backgroundColor: "#e6cb62",
                                  color: "black",
                                  "&:hover": {
                                    backgroundColor: "#eab308",
                                    color: "white",
                                  },
                                  mr: 1,
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleDelete(req._id)}
                                disabled={req.claim_status !== "Draft"}
                                sx={{
                                  backgroundColor: "#dc2626",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#ef4444",
                                  },
                                  mr: 1,
                                }}
                              >
                                Delete
                              </Button>
                              {(req.claim_status === "Draft" ||
                                req.claim_status === "Returned") && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleRequestApproval(req._id)}
                                  sx={{
                                    backgroundColor: "#46d179",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: "#16a34a",
                                    },
                                  }}
                                >
                                  Request Approval
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>

          {/* Add Request Modal */}
          <Dialog
            open={isAddModalVisible}
            onClose={handleModalCancel}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                fontSize: "1.25rem",
                position: "relative",
                backgroundColor: "#f3f4f6",
              }}
            >
              Add Request
              <IconButton
                aria-label="close"
                onClick={handleModalCancel}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <form onSubmit={handleAddModalOk}>
                <TextField
                  label="Request Name"
                  name="claim_name"
                  value={formValues.claim_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Project Name</InputLabel>
                  <Select
                    name="project_id"
                    value={formValues.project_id}
                    onChange={handleSelectChange}
                    required
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.project_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                    freeSolo
                    options={approvers.map((approver) => approver.user_name)}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue) {
                        fetchApprovers(newInputValue);
                      }
                    }}
                    onChange={(event, newValue) => {
                      const selectedApprover = approvers.find(
                        (approver) => approver.user_name === newValue
                      );
                      if (selectedApprover) {
                        setFormValues({
                          ...formValues,
                          approval_id: selectedApprover._id,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Approver" required />
                    )}
                  />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "16px" }}
                  >
                    <DatePicker
                      label="Start Date"
                      value={formValues.claim_start_date}
                      onChange={(date) =>
                        handleDateChange("claim_start_date", date)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                    <DatePicker
                      label="End Date"
                      value={formValues.claim_end_date}
                      onChange={(date) =>
                        handleDateChange("claim_end_date", date)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </div>
                </LocalizationProvider>
                {dateError && <p className="error-message">{dateError}</p>}
                <TextField
                  label="Total Times"
                  name="total_work_time"
                  type="number"
                  value={formValues.total_work_time}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
                <DialogActions sx={{ p: 0, mt: 3 }}>
                  <Button onClick={handleModalCancel} variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Add
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Request Modal */}
          <Dialog
            open={isEditModalVisible}
            onClose={handleModalCancel}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                fontSize: "1.25rem",
                position: "relative",
                backgroundColor: "#f3f4f6",
              }}
            >
              Edit Request
              <IconButton
                aria-label="close"
                onClick={handleModalCancel}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <form onSubmit={handleEditModalOk}>
                <TextField
                  label="Request Name"
                  name="claim_name"
                  value={formValues.claim_name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Project Name</InputLabel>
                  <Select
                    name="project_id"
                    value={formValues.project_id}
                    onChange={handleSelectChange}
                    required
                  >
                    {projects.map((project) => (
                      <MenuItem key={project._id} value={project._id}>
                        {project.project_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                    freeSolo
                    options={approvers.map((approver) => approver.user_name)}
                    onInputChange={(event, newInputValue) => {
                      if (newInputValue) {
                        fetchApprovers(newInputValue);
                      }
                    }}
                    onChange={(event, newValue) => {
                      const selectedApprover = approvers.find(
                        (approver) => approver.user_name === newValue
                      );
                      if (selectedApprover) {
                        setFormValues({
                          ...formValues,
                          approval_id: selectedApprover._id,
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Approver" required />
                    )}
                  />
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <div
                    style={{ display: "flex", gap: "16px", marginTop: "16px" }}
                  >
                    <DatePicker
                      label="Start Date"
                      value={formValues.claim_start_date}
                      onChange={(date) =>
                        handleDateChange("claim_start_date", date)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                    <DatePicker
                      label="End Date"
                      value={formValues.claim_end_date}
                      onChange={(date) =>
                        handleDateChange("claim_end_date", date)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </div>
                </LocalizationProvider>
                {dateError && <p className="error-message">{dateError}</p>}
                <TextField
                  label="Total Times"
                  name="total_work_time"
                  type="number"
                  value={formValues.total_work_time}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
                <DialogActions sx={{ p: 0, mt: 3 }}>
                  <Button onClick={handleModalCancel} variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save Changes
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>

          {/* Confirm Approval Modal */}
          <Dialog
            open={isConfirmModalVisible}
            onClose={() => setIsConfirmModalVisible(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                fontSize: "1.25rem",
                position: "relative",
                backgroundColor: "#f3f4f6",
              }}
            >
              Confirm Approval Request
              <IconButton
                aria-label="close"
                onClick={() => setIsConfirmModalVisible(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <p style={{ marginTop: "16px", fontSize: "1rem" }}>
                Are you sure you want to submit this request for approval?
              </p>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setIsConfirmModalVisible(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmApproval}
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog
            open={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                fontSize: "1.25rem",
                position: "relative",
                backgroundColor: "#f3f4f6",
              }}
            >
              Confirm Delete
              <IconButton
                aria-label="close"
                onClick={() => setIsDeleteModalVisible(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <p style={{ marginTop: "16px", fontSize: "1rem" }}>
                Are you sure you want to delete this request?
              </p>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setIsDeleteModalVisible(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default RequestPage;

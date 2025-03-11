import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import "./ApproveRequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../../../shared/layouts/Layout";

const API_URL = "https://management-claim-request.vercel.app/api";

const convertToLocalTime = (utcDate: string) => {
  return moment.utc(utcDate).utcOffset(7).format("YYYY-MM-DD");
};

interface Request {
  _id: string;
  claim_name: string;
  claim_status: string;
  created_at: string;
  staff_id: string;
  staff_name: string;
  staff_email: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  approval_id: string;
  project_id: string;
  remark: string;
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
  email: string;
  role_code: string;
}

interface IFormInput {
  claim_name: string;
  claim_start_date: moment.Moment | null;
  claim_end_date: moment.Moment | null;
  total_work_time: number | null;
  project_id: string;
  approval_id: string;
  remark: string;
}

const schema = yup
  .object({
    claim_name: yup.string().required("Claim Name is required"),
    claim_start_date: yup.date().nullable().required("Start Date is required"),
    claim_end_date: yup
      .date()
      .nullable()
      .required("End Date is required")
      .test("endDate", "End Date must be after Start Date", function (value) {
        const { claim_start_date } = this.parent;
        if (!claim_start_date || !value) return true;
        return moment(claim_start_date).isSameOrBefore(moment(value), "day");
      }),
    total_work_time: yup
      .number()
      .required("Total Work Time is required")
      .positive("Total Work Time must be positive")
      .min(1, "Total Work Time must be at least 1")
      .integer("Total Work Time must be a whole number"),
    project_id: yup.string().required("Project is required"),
    approval_id: yup.string().required("Approver is required"),
    remark: yup.string(),
  })
  .required();

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      claim_name: "",
      claim_start_date: null,
      claim_end_date: null,
      total_work_time: null,
      project_id: "",
      approval_id: "",
      remark: "",
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Decode token để lấy userId
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

  // Effect chính để fetch data
  useEffect(() => {
    if (!token || !userId) {
      console.log("Missing credentials:", { token: !!token, userId: !!userId });
      return;
    }

    const fetchRequests = async () => {
      try {
        console.log("Fetching requests...");
        const response = await axios.post(
          `${API_URL}/claims/claimer-search`,
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

        if (response.data.success) {
          setRequests(response.data.data.pageData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        console.log("Fetching projects for userId:", userId);
        // Fetch tất cả projects trước
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

          // Lọc projects mà user là thành viên
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

    const fetchApprovers = async () => {
      try {
        console.log("Fetching approvers...");
        const response = await axios.post(
          `${API_URL}/users/search`,
          {
            searchCondition: {
              keyword: "",
              role_code: "A001", // Chỉ lấy users có role Admin
              is_blocked: false,
              is_delete: false,
              is_verified: true, // Thêm điều kiện này để chỉ lấy tài khoản đã xác minh
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

        if (response.data.success) {
          console.log(
            "Approvers fetched successfully:",
            response.data.data.pageData
          );
          setApprovers(response.data.data.pageData);
        } else {
          console.error("Failed to fetch approvers:", response.data);
          setApprovers([]);
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
        setApprovers([]);
      }
    };

    // Gọi tất cả các hàm fetch
    fetchRequests();
    fetchProjects();
    fetchApprovers();
  }, [token, userId]);

  const checkDateOverlap = (
    startDate: moment.Moment,
    endDate: moment.Moment,
    currentId?: string
  ) => {
    return requests.some((req) => {
      if (currentId && req._id === currentId) return false;

      const reqStartDate = moment(req.claim_start_date);
      const reqEndDate = moment(req.claim_end_date);

      return (
        startDate.isBetween(reqStartDate, reqEndDate, "day", "[]") ||
        endDate.isBetween(reqStartDate, reqEndDate, "day", "[]") ||
        reqStartDate.isBetween(startDate, endDate, "day", "[]") ||
        reqEndDate.isBetween(startDate, endDate, "day", "[]")
      );
    });
  };

  const handleAddModalOk = async (data: IFormInput) => {
    if (!token) return;

    if (
      data.claim_start_date &&
      data.claim_end_date &&
      checkDateOverlap(data.claim_start_date, data.claim_end_date)
    ) {
      setDateError("The selected date range overlaps with an existing claim.");
      return;
    }

    try {
      const newClaim = {
        project_id: data.project_id,
        approval_id: data.approval_id,
        claim_name: data.claim_name,
        claim_start_date: data.claim_start_date?.toISOString(),
        claim_end_date: data.claim_end_date?.toISOString(),
        total_work_time: data.total_work_time,
        remark: data.remark || "",
      };

      const response = await axios.post(`${API_URL}/claims`, newClaim, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Refresh the claims list
        const updatedResponse = await axios.post(
          `${API_URL}/claims/claimer-search`,
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

        if (updatedResponse.data.success) {
          setRequests(updatedResponse.data.data.pageData);
        }
      }

      setIsAddModalVisible(false);
      reset();
      setDateError(null);
    } catch (error) {
      console.error("Error adding claim:", error);
    }
  };

  const handleEditModalOk = async (data: IFormInput) => {
    if (!currentRequest || !token) return;

    if (
      data.claim_start_date &&
      data.claim_end_date &&
      checkDateOverlap(
        data.claim_start_date,
        data.claim_end_date,
        currentRequest._id
      )
    ) {
      setDateError("The selected date range overlaps with an existing claim.");
      return;
    }

    try {
      const updatedClaim = {
        _id: currentRequest._id,
        project_id: data.project_id,
        approval_id: data.approval_id,
        claim_name: data.claim_name,
        claim_start_date: data.claim_start_date?.toISOString(),
        claim_end_date: data.claim_end_date?.toISOString(),
        total_work_time: data.total_work_time,
        remark: data.remark || "",
      };

      const response = await axios.put(
        `${API_URL}/claims/${currentRequest._id}`,
        updatedClaim,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh the claims list
        const updatedResponse = await axios.post(
          `${API_URL}/claims/claimer-search`,
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

        if (updatedResponse.data.success) {
          setRequests(updatedResponse.data.data.pageData);
        }
      }

      setIsEditModalVisible(false);
      setCurrentRequest(null);
      reset();
    } catch (error) {
      console.error("Error editing claim:", error);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteRequestId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRequestId || !token) return;

    try {
      const response = await axios.put(
        `${API_URL}/claims/change-status`,
        {
          claim_id: deleteRequestId,
          claim_status: "Canceled",
          comment: "Canceled by user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh the claims list
        const updatedResponse = await axios.post(
          `${API_URL}/claims/claimer-search`,
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

        if (updatedResponse.data.success) {
          setRequests(updatedResponse.data.data.pageData);
        }
      }

      setDeleteDialogOpen(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error("Error deleting claim:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteRequestId(null);
  };

  const handleRequestApproval = async (id: string) => {
    if (!token) return;

    try {
      const response = await axios.put(
        `${API_URL}/claims/change-status`,
        {
          claim_id: id,
          claim_status: "Pending Approval",
          comment: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh the claims list
        const updatedResponse = await axios.post(
          `${API_URL}/claims/claimer-search`,
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

        if (updatedResponse.data.success) {
          setRequests(updatedResponse.data.data.pageData);
        }
      }
    } catch (error) {
      console.error("Error sending approval request:", error);
    }
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setCurrentRequest(null);
    reset();
    setDateError(null);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p._id === projectId);
    return project ? project.project_name : "Unknown Project";
  };

  const getApproverName = (approverId: string) => {
    const approver = approvers.find((a) => a._id === approverId);
    return approver ? approver.user_name : "Unknown Approver";
  };

  return (
    <Layout>
      <div
        className={`request-container-approval ${
          isAddModalVisible || isEditModalVisible ? "blur-background" : ""
        }`}
      >
        <div className="request-box-approval">
          <h1 className="request-title-approval">Manage Claim Requests</h1>

          <div className="search-container-approval">
            <TextField
              type="text"
              placeholder="Search requests..."
              className="search-input-approval"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={() => setIsAddModalVisible(true)}
              className="add-button-approval"
            >
              + Add Claim
            </Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="request-table-approval">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Claim Name</th>
                  <th>Status</th>
                  <th>Project</th>
                  <th>Approver</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Work Time (Hours)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .filter((req) =>
                    req.claim_name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((req) => (
                    <tr key={req._id}>
                      <td>{req._id.substring(req._id.length - 6)}</td>
                      <td>{req.claim_name}</td>
                      <td
                        className={`status-${req.claim_status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}-approval`}
                      >
                        {req.claim_status}
                      </td>
                      <td>{getProjectName(req.project_id)}</td>
                      <td>{getApproverName(req.approval_id)}</td>
                      <td>{convertToLocalTime(req.claim_start_date)}</td>
                      <td>{convertToLocalTime(req.claim_end_date)}</td>
                      <td>{req.total_work_time}</td>
                      <td>
                        <Button
                          onClick={() => {
                            setCurrentRequest(req);
                            reset({
                              claim_name: req.claim_name,
                              claim_start_date: moment(req.claim_start_date),
                              claim_end_date: moment(req.claim_end_date),
                              total_work_time: req.total_work_time,
                              project_id: req.project_id,
                              approval_id: req.approval_id,
                              remark: req.remark || "",
                            });
                            setIsEditModalVisible(true);
                          }}
                          className="edit-button-approval"
                          disabled={req.claim_status !== "Draft"}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(req._id)}
                          className="delete-button-approval"
                          disabled={req.claim_status !== "Draft"}
                        >
                          Delete
                        </Button>
                        {req.claim_status === "Draft" && (
                          <Button
                            onClick={() => handleRequestApproval(req._id)}
                            className="approve-button-approval"
                          >
                            Request Approval
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        <Modal
          open={isAddModalVisible}
          onClose={handleModalCancel}
          className="custom-modal-approval"
        >
          <div className="modal-content">
            <h2>Add Claim</h2>
            <form onSubmit={handleSubmit(handleAddModalOk)}>
              <Controller
                name="claim_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Claim Name"
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.claim_name}
                    helperText={errors.claim_name?.message}
                  />
                )}
              />

              <Controller
                name="project_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.project_id}
                  >
                    <InputLabel id="project-select-label">Project</InputLabel>
                    <Select
                      {...field}
                      labelId="project-select-label"
                      label="Project"
                      required
                    >
                      {projects.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.project_name} ({project.project_code})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.project_id && (
                      <FormHelperText>
                        {errors.project_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="approval_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.approval_id}
                    className="approver-select"
                  >
                    <InputLabel id="approver-select-label">Approver</InputLabel>
                    <Select
                      {...field}
                      labelId="approver-select-label"
                      label="Approver"
                      required
                    >
                      {approvers && approvers.length > 0 ? (
                        approvers.map((approver) => (
                          <MenuItem key={approver._id} value={approver._id}>
                            {approver.user_name} ({approver.email})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No approvers available</MenuItem>
                      )}
                    </Select>
                    {errors.approval_id && (
                      <FormHelperText>
                        {errors.approval_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  name="claim_start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Start Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          error: !!errors.claim_start_date,
                          helperText: errors.claim_start_date?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="claim_end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          error: !!errors.claim_end_date,
                          helperText: errors.claim_end_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>

              <Controller
                name="total_work_time"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Work Time (Hours)"
                    type="number"
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.total_work_time}
                    helperText={errors.total_work_time?.message}
                  />
                )}
              />

              <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remark"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                  />
                )}
              />

              {dateError && <p className="error-message">{dateError}</p>}

              <div className="modal-actions">
                <Button onClick={handleModalCancel} className="cancel-button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="submit-button"
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          open={isEditModalVisible}
          onClose={handleModalCancel}
          className="custom-modal-approval"
        >
          <div className="modal-content">
            <h2>Edit Claim</h2>
            <form onSubmit={handleSubmit(handleEditModalOk)}>
              <Controller
                name="claim_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Claim Name"
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.claim_name}
                    helperText={errors.claim_name?.message}
                  />
                )}
              />

              <Controller
                name="project_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.project_id}
                  >
                    <InputLabel id="project-select-label">Project</InputLabel>
                    <Select
                      {...field}
                      labelId="project-select-label"
                      label="Project"
                      required
                    >
                      {projects.map((project) => (
                        <MenuItem key={project._id} value={project._id}>
                          {project.project_name} ({project.project_code})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.project_id && (
                      <FormHelperText>
                        {errors.project_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="approval_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    margin="normal"
                    error={!!errors.approval_id}
                    className="approver-select"
                  >
                    <InputLabel id="approver-select-label">Approver</InputLabel>
                    <Select
                      {...field}
                      labelId="approver-select-label"
                      label="Approver"
                      required
                    >
                      {approvers.map((approver) => (
                        <MenuItem key={approver._id} value={approver._id}>
                          {approver.user_name} ({approver.email})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.approval_id && (
                      <FormHelperText>
                        {errors.approval_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  name="claim_start_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Start Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          error: !!errors.claim_start_date,
                          helperText: errors.claim_start_date?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="claim_end_date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          error: !!errors.claim_end_date,
                          helperText: errors.claim_end_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>

              <Controller
                name="total_work_time"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Work Time (Hours)"
                    type="number"
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.total_work_time}
                    helperText={errors.total_work_time?.message}
                  />
                )}
              />

              <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Remark"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                  />
                )}
              />

              {dateError && <p className="error-message">{dateError}</p>}

              <div className="modal-actions">
                <Button onClick={handleModalCancel} className="cancel-button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="submit-button"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this claim? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default RequestPage;

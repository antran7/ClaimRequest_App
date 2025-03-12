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
} from "@mui/material";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Layout from "../../../../shared/layouts/Layout";

const API_URL = "https://management-claim-request.vercel.app/api";

interface Request {
  _id: string;
  user_id: string;
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUserEmail = localStorage.getItem("userEmail");
        if (currentUserEmail) {
          setUserEmail(currentUserEmail);
          const response = await axios.get(`${API_URL}/users/${currentUserEmail}`);
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
      setLoading(true); // Ensure loading is set to true at the start
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
        console.log("Response received:", response.data);
        if (response.data.success) {
          const userRequests = response.data.data.pageData.filter(
            (req: Request) => req.user_id === userId
          );
          setRequests(userRequests);
        } else {
          console.error("Failed to fetch requests:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false at the end
      }
    };

    fetchRequests();
  }, [userEmail, userId, token]);

  useEffect(() => {
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

    if (userId) {
      fetchProjects();
    }
  }, [token, userId]);

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

  const handleAddModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("handleAddModalOk called");
    console.log("formValues:", formValues);
  
    if (!userEmail || !userId || !token) {
      console.error("Missing userEmail, userId, or token");
      return;
    }
  
    if (
      formValues.claim_end_date &&
      formValues.claim_start_date &&
      formValues.claim_end_date.isBefore(formValues.claim_start_date)
    ) {
      setDateError("End date cannot be before start date");
      return;
    }
  
    try {
      const newRequest = {
        project_id: formValues.project_id,
        approval_id: formValues.approval_id,
        claim_name: formValues.claim_name,
        claim_start_date: formValues.claim_start_date
          ? formValues.claim_start_date.toISOString()
          : "",
        claim_end_date: formValues.claim_end_date
          ? formValues.claim_end_date.toISOString()
          : "",
        total_work_time: formValues.total_work_time,
        remark: "",
      };
  
      console.log("newRequest:", newRequest);
  
      const response = await axios.post(`${API_URL}/claims`, newRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("response:", response.data);
  
      if (response.data.success) {
        setRequests([...requests, response.data.data]);
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
      }
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };
  

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
      await axios.put(`${API_URL}/claims/${currentRequest._id}`, updatedRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(
        requests.map((req) =>
          req._id === currentRequest._id
            ? { ...updatedRequest, claim_start_date: updatedRequest.claim_start_date || "", claim_end_date: updatedRequest.claim_end_date || "" }
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
          req._id === requestToApprove ? { ...req, claim_status: "Pending Approval" } : req
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

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name as string]: value as string });
  };

  const handleDateChange = (name: string, date: moment.Moment | null) => {
    setFormValues({ ...formValues, [name]: date });
  };

  return (
    <Layout>
      <div
        className={`request-container ${
          isAddModalVisible || isEditModalVisible ? "blur-background" : ""
        }`}
      >
        <div className="request-box">
          <h1 className="request-title">Manage Claim Requests</h1>

          <div className="search-container">
            <TextField
              type="text"
              placeholder="Search requests..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={() => setIsAddModalVisible(true)}
              className="add-button"
            >
              + Add Request
            </Button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request Name</th>
                  <th>Project Name</th>
                  <th>Approver</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Times (Hours)</th>
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
                      <td>{req._id}</td>
                      <td>{req.claim_name}</td>
                      <td>
                        {projects.find((project) => project._id === req.project_id)
                          ?.project_name || "Unknown Project"}
                      </td>
                      <td className={`status-${req.claim_status.toLowerCase()}`}>
                        {req.claim_status}
                      </td>
                      <td>{moment(req.claim_start_date).format("YYYY-MM-DD")}</td>
                      <td>{moment(req.claim_end_date).format("YYYY-MM-DD")}</td>
                      <td>{req.total_work_time}</td>
                      <td>
                        <Button
                          onClick={() => {
                            setCurrentRequest(req);
                            setIsEditModalVisible(true);
                            setFormValues({
                              claim_name: req.claim_name,
                              project_id: req.project_id,
                              approval_id: req.approval_id,
                              claim_start_date: moment(req.claim_start_date),
                              claim_end_date: moment(req.claim_end_date),
                              total_work_time: req.total_work_time,
                            });
                          }}
                          className="edit-button"
                          disabled={
                            req.claim_status !== "Draft" &&
                            req.claim_status !== "Returned"
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(req._id)}
                          className="delete-button"
                          disabled={req.claim_status !== "Draft"}
                        >
                          Delete
                        </Button>
                        {(req.claim_status === "Draft" ||
                          req.claim_status === "Returned") && (
                          <Button
                            onClick={() => handleRequestApproval(req._id)}
                            className="approve-button"
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
          className="custom-modal"
        >
          <div className="modal-content">
            <h2>Add Request</h2>
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
                    console.log("Autocomplete input changed:", newInputValue);
                    if (newInputValue) {
                      fetchApprovers(newInputValue);
                    }
                  }}
                  onChange={(event, newValue) => {
                    console.log("Autocomplete value changed:", newValue);
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
                    <TextField
                      {...params}
                      label="Approver"
                      margin="normal"
                      required
                    />
                  )}
                />
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Start Date"
                  value={formValues.claim_start_date}
                  onChange={(date) => handleDateChange("claim_start_date", date)}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal", required: true },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={formValues.claim_end_date}
                  onChange={(date) => handleDateChange("claim_end_date", date)}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal", required: true },
                  }}
                />
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
              <Button type="submit" variant="contained" color="primary">
                Add
              </Button>
            </form>
          </div>
        </Modal>

        <Modal
          open={isEditModalVisible}
          onClose={handleModalCancel}
          className="custom-modal"
        >
          <div className="modal-content">
            <h2>Edit Request</h2>
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
                    <TextField
                      {...params}
                      label="Approver"
                      margin="normal"
                      required
                    />
                  )}
                />
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Start Date"
                  value={formValues.claim_start_date}
                  onChange={(date) => handleDateChange("claim_start_date", date)}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal", required: true },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={formValues.claim_end_date}
                  onChange={(date) => handleDateChange("claim_end_date", date)}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal", required: true },
                  }}
                />
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
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </form>
          </div>
        </Modal>

        <Modal
          open={isConfirmModalVisible}
          onClose={() => setIsConfirmModalVisible(false)}
          className="custom-modal"
        >
          <div className="modal-content">
            <h2>Confirm Approval</h2>
            <p>Are you sure you want to approve this request?</p>
            <Button
              onClick={handleConfirmApproval}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setIsConfirmModalVisible(false)}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        </Modal>

        <Modal
          open={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          className="custom-modal"
        >
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this request?</p>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setIsDeleteModalVisible(false)}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default RequestPage;
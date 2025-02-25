import { useState, useEffect } from "react";
import { Modal, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const API_REQUESTS = "https://67b5a06d07ba6e59083db637.mockapi.io/api/requests";
const API_PROJECTS = "https://67aaae7465ab088ea7e73b54.mockapi.io/project";

interface Request {
  id: number;
  name: string;
  projectName: string;
  status: string;
  startDate: string;
  endDate: string;
  totalTimes: number;
  submittedDate: string;
  createDate: string;
  userId: number;
  userEmail: string;
  reason: string;
}

interface Project {
  id: number;
  name: string;
}

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<{
    name: string;
    projectName: string;
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
    totalTimes: number;
  }>({
    name: "",
    projectName: "",
    startDate: null,
    endDate: null,
    totalTimes: 0,
  });
  const [userEmail, setUserEmail] = useState<string>("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUserEmail = localStorage.getItem("userEmail");
        if (currentUserEmail) {
          setUserEmail(currentUserEmail);
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchRequests = async () => {
      try {
        const response = await axios.get(API_REQUESTS);
        const userRequests = response.data.filter(
          (req: Request) => req.userEmail === userEmail
        );
        setRequests(userRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_PROJECTS);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleAddModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userEmail) return;

    if (formValues.endDate && formValues.startDate && formValues.endDate.isBefore(formValues.startDate)) {
      setDateError("End date cannot be before start date");
      return;
    }

    try {
      const newRequest = {
        name: formValues.name,
        projectName: formValues.projectName,
        status: "Draft",
        startDate: formValues.startDate ? formValues.startDate.format("YYYY-MM-DD") : "",
        endDate: formValues.endDate ? formValues.endDate.format("YYYY-MM-DD") : "",
        totalTimes: formValues.totalTimes,
        createDate: moment().format("YYYY-MM-DD"),
        submittedDate: moment().format("YYYY-MM-DD"),
        userEmail: userEmail,
        userId: 1,
        reason: "Draft",
      };

      const response = await axios.post(API_REQUESTS, newRequest);
      setRequests([...requests, response.data]);
      setIsAddModalVisible(false);
      setFormValues({
        name: "",
        projectName: "",
        startDate: null,
        endDate: null,
        totalTimes: 0,
      });
      setDateError(null);
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const handleEditModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentRequest) return;

    if (formValues.endDate && formValues.startDate && formValues.endDate.isBefore(formValues.startDate)) {
      setDateError("End date cannot be before start date");
      return;
    }

    try {
      const updatedRequest = {
        ...currentRequest,
        name: formValues.name,
        projectName: formValues.projectName,
        startDate: formValues.startDate ? formValues.startDate.format("YYYY-MM-DD") : null,
        endDate: formValues.endDate ? formValues.endDate.format("YYYY-MM-DD") : null,
        totalTimes: formValues.totalTimes,
      };
      await axios.put(`${API_REQUESTS}/${currentRequest.id}`, updatedRequest);
      setRequests(
        requests.map((req) =>
          req.id === currentRequest.id ? { ...updatedRequest, startDate: updatedRequest.startDate || "", endDate: updatedRequest.endDate || "" } : req
        )
      );
      setIsEditModalVisible(false);
      setCurrentRequest(null);
      setDateError(null);
    } catch (error) {
      console.error("Error editing request:", error);
    }
  };

  const handleDelete = async (id: number) => {
    setRequestToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (requestToDelete === null) return;

    try {
      await axios.delete(`${API_REQUESTS}/${requestToDelete}`);
      setRequests(requests.filter((req) => req.id !== requestToDelete));
      setIsDeleteModalVisible(false);
      setRequestToDelete(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleRequestApproval = async (id: number) => {
    setRequestToApprove(id);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmApproval = async () => {
    if (requestToApprove === null) return;

    try {
      await axios.put(`${API_REQUESTS}/${requestToApprove}`, {
        status: "Pending",
        reason: "Draft",
      });
      setRequests(
        requests.map((req) =>
          req.id === requestToApprove ? { ...req, status: "Pending", reason: "Draft" } : req
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
      name: "",
      projectName: "",
      startDate: null,
      endDate: null,
      totalTimes: 0,
    });
    setDateError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDateChange = (name: string, date: moment.Moment | null) => {
    setFormValues({ ...formValues, [name]: date });
  };

  return (
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
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Times (Hours)</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests
                .filter((req) =>
                  req.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((req) => (
                  <tr key={req.id}>
                    <td>{req.id}</td>
                    <td>{req.name}</td>
                    <td>{req.projectName}</td>
                    <td className={`status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.totalTimes}</td>
                    <td>{req.reason}</td>
                    <td>
                      <Button
                        onClick={() => {
                          setCurrentRequest(req);
                          setIsEditModalVisible(true);
                          setFormValues({
                            name: req.name,
                            projectName: req.projectName,
                            startDate: moment(req.startDate),
                            endDate: moment(req.endDate),
                            totalTimes: req.totalTimes,
                          });
                        }}
                        className="edit-button"
                        disabled={req.status !== "Draft" && req.status !== "Returned"}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(req.id)}
                        className="delete-button"
                        disabled={req.status !== "Draft"}
                      >
                        Delete
                      </Button>
                      {(req.status === "Draft" || req.status === "Returned") && (
                        <Button
                          onClick={() => handleRequestApproval(req.id)}
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
              name="name"
              value={formValues.name}
              onChange={(e) => handleInputChange({ target: { name: e.target.name, value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Project Name</InputLabel>
                <Select
                name="projectName"
                value={formValues.projectName}
                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                required
                >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.name}>
                  {project.name}
                  </MenuItem>
                ))}
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
              label="Start Date"
              value={formValues.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
              <DatePicker
              label="End Date"
              value={formValues.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
            </LocalizationProvider>
            {dateError && <p className="error-message">{dateError}</p>}
            <TextField
              label="Total Times"
              name="totalTimes"
              type="number"
              value={formValues.totalTimes}
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
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Project Name</InputLabel>
                <Select
                name="projectName"
                value={formValues.projectName}
                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                required
                >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.name}>
                  {project.name}
                  </MenuItem>
                ))}
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
              label="Start Date"
              value={formValues.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
              <DatePicker
              label="End Date"
              value={formValues.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              slotProps={{ textField: { fullWidth: true, margin: "normal", required: true } }}
              />
            </LocalizationProvider>
            {dateError && <p className="error-message">{dateError}</p>}
            <TextField
              label="Total Times"
              name="totalTimes"
              type="number"
              value={formValues.totalTimes}
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
          <Button onClick={handleConfirmApproval} variant="contained" color="primary">
            Confirm
          </Button>
          <Button onClick={() => setIsConfirmModalVisible(false)} variant="contained" color="secondary">
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
          <Button onClick={handleConfirmDelete} variant="contained" color="primary">
            Confirm
          </Button>
          <Button onClick={() => setIsDeleteModalVisible(false)} variant="contained" color="secondary">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RequestPage;

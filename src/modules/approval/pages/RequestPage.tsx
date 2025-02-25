import { useState, useEffect } from "react";
import { Modal, Button, TextField } from "@mui/material";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const API_REQUESTS = "https://67245b0d493fac3cf24dfc59.mockapi.io/api/approver";

interface Request {
  id: number;
  name: string;
  status: string;
  submittedDate: string;
  createDate: string;
  userId: number;
  userEmail: string;
  startDate: string;
  endDate: string;
  totalTimes: number;
  reason: string;
}

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");

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

  const handleAddModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userEmail) return;

    try {
      const newRequest = {
        name: "New Request",
        status: "DRAFT",
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().add(1, "days").format("YYYY-MM-DD"),
        totalTimes: 8,
        reason: "DRAFT",
        userEmail: userEmail,
        userId: 1,
      };

      const response = await axios.post(API_REQUESTS, newRequest);
      setRequests([...requests, response.data]);
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const handleEditModalOk = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentRequest) return;

    try {
      const updatedRequest = { ...currentRequest, name: "Updated Request" };
      await axios.put(`${API_REQUESTS}/${currentRequest.id}`, updatedRequest);
      setRequests(
        requests.map((req) =>
          req.id === currentRequest.id ? updatedRequest : req
        )
      );
      setIsEditModalVisible(false);
      setCurrentRequest(null);
    } catch (error) {
      console.error("Error editing request:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_REQUESTS}/${id}`);
      setRequests(requests.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleRequestApproval = async (id: number) => {
    try {
      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: "PENDING" } : req
      );
      setRequests(updatedRequests);
      await axios.put(`${API_REQUESTS}/${id}`, { status: "PENDING" });
    } catch (error) {
      console.error("Error sending approval request:", error);
    }
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setCurrentRequest(null);
  };

  return (
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
            + Add Request
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="request-table-approval">
            <thead>
              <tr>
                <th>ID</th>
                <th>Request Name</th>
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
                    <td
                      className={`status-${req.status.toLowerCase()}-approval`}
                    >
                      {req.status}
                    </td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.totalTimes}</td>
                    <td
                      className={
                        req.reason === "DRAFT" ? "reason-draft-approval" : ""
                      }
                    >
                      {req.reason}
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          setCurrentRequest(req);
                          setIsEditModalVisible(true);
                        }}
                        className="edit-button-approval"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(req.id)}
                        className="delete-button-approval"
                      >
                        Delete
                      </Button>
                      {req.status === "DRAFT" && (
                        <Button
                          onClick={() => handleRequestApproval(req.id)}
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
          <h2>Add Request</h2>
          <form onSubmit={handleAddModalOk}>
            <TextField
              label="Request Name"
              name="name"
              required
              fullWidth
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Start Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                  },
                }}
              />
              <DatePicker
                label="End Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Total Times"
              name="totalTimes"
              type="number"
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
        className="custom-modal-approval"
      >
        <div className="modal-content">
          <h2>Edit Request</h2>
          <form onSubmit={handleEditModalOk}>
            <TextField
              label="Request Name"
              name="name"
              required
              fullWidth
              margin="normal"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Start Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                  },
                }}
              />
              <DatePicker
                label="End Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Total Times"
              name="totalTimes"
              type="number"
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
    </div>
  );
};

export default RequestPage;

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
} from "@mui/material";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "../../../shared/layouts/Layout";

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

interface IFormInput {
  name: string;
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  totalTimes: number | null;
}

const schema = yup
  .object({
    name: yup.string().required("Request Name is required"),
    startDate: yup
      .date()
      .nullable()
      .required("Start Date is required")
      .test(
        "startDate",
        "Start Date cannot be in the future",
        function (value) {
          if (!value) return true;
          return moment(value).isSameOrBefore(moment(), "day");
        }
      )
      .test(
        "startDate",
        "Start Date must be before End Date",
        function (value) {
          const { endDate } = this.parent;
          if (!endDate || !value) return true;
          return moment(value).isSameOrBefore(moment(endDate), "day");
        }
      ),
    endDate: yup
      .date()
      .nullable()
      .required("End Date is required")
      .test("endDate", "End Date cannot be in the future", function (value) {
        if (!value) return true;
        return moment(value).isSameOrBefore(moment(), "day");
      })
      .test("endDate", "End Date must be after Start Date", function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return moment(startDate).isSameOrBefore(moment(value), "day");
      }),
    totalTimes: yup
      .number()
      .required("Total Times is required")
      .positive("Total Times must be positive")
      .min(1, "Total Times must be at least 1")
      .integer("Total Times must be a whole number"),
  })
  .required();

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      startDate: null,
      endDate: null,
      totalTimes: null,
    },
  });

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

  const handleAddModalOk = async (data: IFormInput) => {
    if (!userEmail) return;

    try {
      const newRequest = {
        name: data.name,
        status: "DRAFT",
        startDate: moment(data.startDate).format("YYYY-MM-DD"),
        endDate: moment(data.endDate).format("YYYY-MM-DD"),
        totalTimes: data.totalTimes,
        reason: "DRAFT",
        userEmail: userEmail,
        userId: 1,
        submittedDate: moment().format("YYYY-MM-DD"),
        createDate: moment().format("YYYY-MM-DD"),
      };

      const response = await axios.post(API_REQUESTS, newRequest);
      setRequests([...requests, response.data]);
      setIsAddModalVisible(false);
      reset();
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const handleEditModalOk = async (data: IFormInput) => {
    if (!currentRequest) return;

    try {
      const updatedRequest: Request = {
        ...currentRequest,
        name: data.name,
        startDate:
          data.startDate?.format("YYYY-MM-DD") || currentRequest.startDate,
        endDate: data.endDate?.format("YYYY-MM-DD") || currentRequest.endDate,
        totalTimes: data.totalTimes || currentRequest.totalTimes,
      };

      await axios.put(`${API_REQUESTS}/${currentRequest.id}`, updatedRequest);
      setRequests(
        requests.map((req) =>
          req.id === currentRequest.id ? updatedRequest : req
        )
      );
      setIsEditModalVisible(false);
      setCurrentRequest(null);
      reset();
    } catch (error) {
      console.error("Error editing request:", error);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteRequestId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRequestId) return;

    try {
      await axios.delete(`${API_REQUESTS}/${deleteRequestId}`);
      setRequests(requests.filter((req) => req.id !== deleteRequestId));
      setDeleteDialogOpen(false);
      setDeleteRequestId(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteRequestId(null);
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
    reset();
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
                            reset({
                              name: req.name,
                              startDate: moment(req.startDate),
                              endDate: moment(req.endDate),
                              totalTimes: req.totalTimes,
                            });
                            setIsEditModalVisible(true);
                          }}
                          className="edit-button-approval"
                          disabled={req.status === "PENDING"}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(req.id)}
                          className="delete-button-approval"
                          disabled={req.status === "PENDING"}
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
            <form onSubmit={handleSubmit(handleAddModalOk)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Request Name"
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  name="startDate"
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
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
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
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="totalTimes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Times"
                    type="number"
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.totalTimes}
                    helperText={errors.totalTimes?.message}
                  />
                )}
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
            <form onSubmit={handleSubmit(handleEditModalOk)}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Request Name"
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Controller
                  name="startDate"
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
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
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
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <Controller
                name="totalTimes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Times"
                    type="number"
                    required
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                    error={!!errors.totalTimes}
                    helperText={errors.totalTimes?.message}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
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
              Are you sure you want to delete this request? This action cannot
              be undone.
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

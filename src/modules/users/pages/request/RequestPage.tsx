import { useState, useEffect } from "react";
import { Modal, Button, Input, Form, DatePicker } from "antd";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";

const API_REQUESTS = "https://67b5a06d07ba6e59083db637.mockapi.io/api/requests";

interface Request {
  id: number;
  name: string;
  status: string;
  submittedDate: string;
  createDate: string;
  userId: number;
  userEmail: string;
}

const RequestPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<number | null>(null);

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

  const handleAddModalOk = async (values: {
    name: string;
    createDate: moment.Moment;
    submittedDate: moment.Moment;
  }) => {
    if (!userEmail) return;

    try {
      const newRequest = {
        name: values.name,
        status: "DRAFT",
        createDate: values.createDate.format("YYYY-MM-DD"),
        submittedDate: values.submittedDate.format("YYYY-MM-DD"),
        userEmail: userEmail,
        userId: 1,
      };

      const response = await axios.post(API_REQUESTS, newRequest);
      setRequests([...requests, response.data]);
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const handleEditModalOk = async (values: { name: string }) => {
    if (!currentRequest) return;

    try {
      const updatedRequest = { ...currentRequest, name: values.name };
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
    setRequestToApprove(id);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmApproval = async () => {
    if (requestToApprove === null) return;

    try {
      const updatedRequests = requests.map((req) =>
        req.id === requestToApprove ? { ...req, status: "PENDING" } : req
      );
      setRequests(updatedRequests);
      await axios.put(`${API_REQUESTS}/${requestToApprove}`, { status: "PENDING" });
      setIsConfirmModalVisible(false);
      setRequestToApprove(null);
    } catch (error) {
      console.error("Error sending approval request:", error);
    }
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setCurrentRequest(null);
    form.resetFields();
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
          <input
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
                <th>Status</th>
                <th>Create Date</th>
                <th>Submitted Date</th>
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
                    <td className={`status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </td>
                    <td>{req.createDate}</td>
                    <td>{req.submittedDate}</td>
                    <td>
                      <Button
                        onClick={() => {
                          setCurrentRequest(req);
                          setIsEditModalVisible(true);
                        }}
                        className="edit-button"
                        disabled={req.status === "PENDING"}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(req.id)}
                        className="delete-button"
                        disabled={req.status === "PENDING"}
                      >
                        Delete
                      </Button>
                      {req.status === "DRAFT" && (
                        <Button
                          onClick={() => handleRequestApproval(req.id)}
                          className="approve-button"
                          style={{
                            backgroundColor: "#16A34A",
                            color: "#FFFFFF",
                            fontWeight: "600",
                            fontSize: "14px",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            transition: "background-color 0.3s ease-in-out, transform 0.1s",
                            border: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#22C55E";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#16A34A";
                          }}
                          onMouseDown={(e) => {
                            e.currentTarget.style.backgroundColor = "#15803D";
                            e.currentTarget.style.transform = "scale(0.96)";
                          }}
                          onMouseUp={(e) => {
                            e.currentTarget.style.backgroundColor = "#22C55E";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
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
        title="Add Request"
        open={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="custom-modal"
      >
        <Form
          form={form}
          onFinish={handleAddModalOk}
          initialValues={{ name: "", createDate: null, submittedDate: null }}
        >
          <Form.Item
            label="Request Name"
            name="name"
            rules={[
              { required: true, message: "Please input the request name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Create Date"
            name="createDate"
            rules={[
              { required: true, message: "Please select the create date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Submitted Date"
            name="submittedDate"
            rules={[
              { required: true, message: "Please select the submitted date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("createDate") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Submitted date cannot be before create date!")
                  );
                },
              }),
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Request"
        open={isEditModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="custom-modal"
      >
        <Form
          key={currentRequest?.id}
          initialValues={currentRequest ?? {}}
          onFinish={handleEditModalOk}
        >
          <Form.Item
            label="Request Name"
            name="name"
            rules={[
              { required: true, message: "Please input the request name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Approval"
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        onOk={handleConfirmApproval}
      >
        <p>Are you sure you want to approve this request?</p>
      </Modal>
    </div>
  );
};

export default RequestPage;
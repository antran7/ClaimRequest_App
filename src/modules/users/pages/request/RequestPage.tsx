import { useState, useEffect } from "react";
import { Modal, Button, Input, Form, DatePicker, Select } from "antd";
import axios from "axios";
import "./RequestPage.css";
import moment from "moment";

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
  const [form] = Form.useForm();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState<number | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);

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

  const handleAddModalOk = async (values: {
    name: string;
    projectName: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    totalTimes: number;
  }) => {
    if (!userEmail) return;

    try {
      const newRequest = {
        name: values.name,
        projectName: values.projectName,
        status: "DRAFT",
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        totalTimes: values.totalTimes,
        createDate: moment().format("YYYY-MM-DD"),
        submittedDate: moment().format("YYYY-MM-DD"),
        userEmail: userEmail,
        userId: 1,
        reason: "DRAFT",
      };

      const response = await axios.post(API_REQUESTS, newRequest);
      setRequests([...requests, response.data]);
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const handleEditModalOk = async (values: {
    name: string;
    projectName: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    totalTimes: number;
  }) => {
    if (!currentRequest) return;

    try {
      const updatedRequest = {
        ...currentRequest,
        name: values.name,
        projectName: values.projectName,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        totalTimes: values.totalTimes,
      };
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
    setIsDeleteModalVisible(false);
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
                <th>Project Name</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Times</th>
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
                          form.setFieldsValue({
                            name: req.name,
                            projectName: req.projectName,
                            startDate: moment(req.startDate),
                            endDate: moment(req.endDate),
                            totalTimes: req.totalTimes,
                          });
                        }}
                        className="edit-button"
                        disabled={req.status !== "DRAFT" && req.status !== "RETURNED"}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(req.id)}
                        className="delete-button"
                        disabled={req.status !== "DRAFT"}
                      >
                        Delete
                      </Button>
                      {(req.status === "DRAFT" || req.status === "RETURNED") && (
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
        title="Add Request"
        open={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="custom-modal"
      >
        <Form
          form={form}
          onFinish={handleAddModalOk}
          initialValues={{ name: "", projectName: "", startDate: null, endDate: null, totalTimes: 0 }}
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
            label="Project Name"
            name="projectName"
            rules={[
              { required: true, message: "Please select the project name!" },
            ]}
          >
            <Select>
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.name}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: "Please select the end date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("startDate") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End date cannot be before start date!")
                  );
                },
              }),
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Total Times"
            name="totalTimes"
            rules={[
              { required: true, message: "Please input the total times!" },
            ]}
          >
            <Input type="number" />
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
          form={form}
          key={currentRequest?.id}
          initialValues={{
            name: currentRequest?.name,
            projectName: currentRequest?.projectName,
            startDate: currentRequest ? moment(currentRequest.startDate) : null,
            endDate: currentRequest ? moment(currentRequest.endDate) : null,
            totalTimes: currentRequest?.totalTimes,
          }}
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
          <Form.Item
            label="Project Name"
            name="projectName"
            rules={[
              { required: true, message: "Please select the project name!" },
            ]}
          >
            <Select>
              {projects.map((project) => (
                <Select.Option key={project.id} value={project.name}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              { required: true, message: "Please select the end date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("startDate") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End date cannot be before start date!")
                  );
                },
              }),
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Total Times"
            name="totalTimes"
            rules={[
              { required: true, message: "Please input the total times!" },
            ]}
          >
            <Input type="number" />
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

      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={handleConfirmDelete}
      >
        <p>Are you sure you want to delete this request?</p>
      </Modal>
    </div>
  );
};

export default RequestPage;
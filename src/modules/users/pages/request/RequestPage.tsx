import { useState, useEffect } from "react";
import { Modal, Button, Input, Form } from "antd";
import "./RequestPage.css"; // Import file CSS riêng

const RequestPage = () => {
  const [requests, setRequests] = useState<
    {
      id: number;
      name: string;
      status: string;
      submittedDate: string;
    }[]
  >([]);
  const [search, setSearch] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<
    { id: number; name: string; status: string; submittedDate: string } | null
  >(null);

  const [form] = Form.useForm(); // Create a form instance

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    setRequests(savedRequests);
  }, []);

  const handleDelete = (id: number) => {
    const updatedRequests = requests.filter((req) => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  const handleRequestApproval = (id: number) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "PENDING" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  const handleAddRequest = () => {
    setIsAddModalVisible(true);
  };

  const handleEditRequest = (request: { id: number; name: string; status: string; submittedDate: string }) => {
    setCurrentRequest({ ...request });
    setIsEditModalVisible(true);
  };

  const handleAddModalOk = (values: { name: string }) => {
    const newRequest = {
      id: requests.length + 1,
      name: values.name,
      status: "DRAFT",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    setIsAddModalVisible(false);
    form.resetFields(); // Reset form fields after adding a request
  };

  const handleEditModalOk = (values: { name: string }) => {
    if (currentRequest) {
      const updatedRequests = requests.map((req) =>
        req.id === currentRequest.id ? { ...req, name: values.name } : req
      );
      setRequests(updatedRequests);
      localStorage.setItem("requests", JSON.stringify(updatedRequests));
      setIsEditModalVisible(false);
      setCurrentRequest(null); // Reset state sau khi sửa xong
    }
  };

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setCurrentRequest(null); // Reset lại request hiện tại
    form.resetFields(); // Reset form fields when modal is closed
  };

  return (
    <div className={`request-container ${isAddModalVisible || isEditModalVisible ? 'blur-background' : ''}`}>
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
          <Button onClick={handleAddRequest} className="add-button">
            + Add Request
          </Button>
        </div>

        <table className="request-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request Name</th>
              <th>Status</th>
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
                  <td>{req.submittedDate}</td>
                  <td>
                    <Button
                      onClick={() => handleEditRequest(req)}
                      className="edit-button"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(req.id)}
                      className="delete-button"
                    >
                      Delete
                    </Button>
                    {req.status === "DRAFT" && (
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
      </div>

      <Modal
        title="Add Request"
        visible={isAddModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="custom-modal"
      >
        <Form form={form} onFinish={handleAddModalOk} initialValues={{ name: "" }}>
          <Form.Item
            label="Request Name"
            name="name"
            rules={[{ required: true, message: "Please input the request name!" }]}
          >
            <Input />
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
        visible={isEditModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        className="custom-modal"
      >
        <Form key={currentRequest?.id} initialValues={currentRequest ?? {}} onFinish={handleEditModalOk}>
          <Form.Item
            label="Request Name"
            name="name"
            rules={[{ required: true, message: "Please input the request name!" }]}
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
    </div>
  );
};

export default RequestPage;
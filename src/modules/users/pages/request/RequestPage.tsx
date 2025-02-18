import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestPage.css";

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
  const navigate = useNavigate();

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

  return (
    <div className="request-container">
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
          <button
            onClick={() => navigate("/addrequest")}
            className="add-button"
          >
            + Add Request
          </button>
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
                    <button
                      onClick={() => navigate(`/editrequest/${req.id}`)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    {req.status === "DRAFT" && (
                      <button
                        onClick={() => handleRequestApproval(req.id)}
                        className="approve-button"
                      >
                        Request Approval
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestPage;

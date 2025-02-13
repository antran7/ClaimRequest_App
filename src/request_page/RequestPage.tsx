import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestPage.css"; // Import file CSS riêng

const RequestPage = () => {
  const [requests, setRequests] = useState<{ id: number; name: string; approved: boolean }[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    setRequests(savedRequests);
  }, []);

  const handleDelete = (id: number) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  const handleApprove = (id: number) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, approved: true } : req
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
            className="add-button">
            + Add Request
          </button>
        </div>

        <table className="request-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(req => req.name.includes(search)).map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.name}</td>
                <td className={req.approved ? "status-approved" : "status-pending"}>
                  {req.approved ? "Approved" : "Pending"}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/editrequest/${req.id}`)} 
                    className="edit-button">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(req.id)} 
                    className="delete-button">
                    Delete
                  </button>
                  {!req.approved && (
                    <button 
                      onClick={() => handleApprove(req.id)} 
                      className="approve-button">
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

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditRequestPage.css"; // Import file CSS riêng

const EditRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    const request = savedRequests.find((req: { id: number }) => req.id === Number(id));
    if (request) {
      setName(request.name);
    }
  }, [id]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    const updatedRequests = savedRequests.map((req: { id: number; name: string }) =>
      req.id === Number(id) ? { ...req, name } : req
    );
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    navigate("/requestpage");
  };

  return (
    <div className="edit-request-container">
      <div className="edit-request-box">
        <h1 className="edit-request-title">Edit Request</h1>
        <form onSubmit={handleUpdate} className="edit-request-form">
          <input
            type="text"
            placeholder="Request Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
          <div className="button-group">
            <button 
              type="button" 
              onClick={() => navigate("/requestpage")} 
              className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="update-button">
              Update Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequestPage;

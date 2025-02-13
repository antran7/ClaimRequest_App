import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddRequestPage.css"; // Import file CSS riêng

const AddRequestPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingRequests = JSON.parse(
      localStorage.getItem("requests") || "[]"
    );
    const newRequest = {
      id: existingRequests.length + 1,
      name,
      status: "DRAFT",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    const updatedRequests = [...existingRequests, newRequest];

    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    navigate("/requestpage");
  };

  return (
    <div className="add-request-container">
      <div className="add-request-box">
        <h1 className="add-request-title">Add New Request</h1>
        <form onSubmit={handleSubmit} className="add-request-form">
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
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRequestPage;

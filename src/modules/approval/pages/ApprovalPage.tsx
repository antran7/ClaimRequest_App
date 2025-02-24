import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApprovalPage.css";

const API_REQUESTS = "https://67b5a06d07ba6e59083db637.mockapi.io/api/requests";
const API_USERS = "https://67b416e6392f4aa94fa93e19.mockapi.io/api/user";

interface RequestData {
  id: string;
  name: string;
  projectName: string;
  requesterName: string;
  startDate: string;
  endDate: string;
  totalTimes: number;
}

const ApprovalPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState("");
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<
    "Rejected" | "Returned" | null
  >(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(API_REQUESTS);
        const userResponse = await axios.get(API_USERS);
        const users = userResponse.data;

        const requestsWithRequester = response.data
          .filter((request: any) => request.status === "Pending")
          .map((request: any) => {
            const user = users.find((u: any) => u.email === request.userEmail);
            return {
              ...request,
              requesterName: user ? user.staffName : "Unknown",
            };
          });

        setRequests(requestsWithRequester);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`${API_REQUESTS}/${id}`, { status: "Approved" });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectOrReturn = (
    id: string,
    action: "Rejected" | "Returned"
  ) => {
    setCurrentRequestId(id);
    setCurrentAction(action);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (action: "Rejected" | "Returned") => {
    if (!currentRequestId) return;

    try {
      await axios.put(`${API_REQUESTS}/${currentRequestId}`, {
        status: action,
        reason: modalReason,
      });
      setRequests((prev) => prev.filter((req) => req.id !== currentRequestId));
      setIsModalOpen(false);
      setModalReason("");
      setCurrentRequestId(null);
    } catch (error) {
      console.error(`Error ${action.toLowerCase()} request:`, error);
    }
  };

  return (
    <div className="approval-container">
      <div
        className={`approval-content ${isModalOpen ? "blur-background" : ""}`}
      >
        <div className="approval-box">
          <h1 className="approval-title">Pending Requests</h1>

          <div className="approval-table-container">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request Name</th>
                  <th>Project Name</th>
                  <th>Requester</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Times (Hours)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.name}</td>
                      <td>{row.projectName}</td>
                      <td>{row.requesterName}</td>
                      <td>{row.startDate}</td>
                      <td>{row.endDate}</td>
                      <td>{row.totalTimes}</td>
                      <td align="center">
                        <div className="action-buttons">
                          <button
                            className="approve-button"
                            onClick={() => handleApprove(row.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-button"
                            onClick={() =>
                              handleRejectOrReturn(row.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                          <button
                            className="return-button"
                            onClick={() =>
                              handleRejectOrReturn(row.id, "Returned")
                            }
                          >
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={(event) =>
                  setRowsPerPage(parseInt(event.target.value, 10))
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </span>
            <span>
              {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, requests.length)} of{" "}
              {requests.length}
            </span>
            <button onClick={() => setPage(page - 1)} disabled={page === 0}>
              {"<"}
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * rowsPerPage >= requests.length}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <button
            className="close-button"
            onClick={() => setIsModalOpen(false)}
          >
            X
          </button>
          <h6>Provide a reason for this action</h6>
          <textarea
            rows={4}
            value={modalReason}
            onChange={(e) => setModalReason(e.target.value)}
            className="modal-textfield"
          />
          <div className="modal-actions">
            <button
              onClick={() => handleModalSubmit(currentAction!)}
              className="submit-button"
            >
              Submit
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;

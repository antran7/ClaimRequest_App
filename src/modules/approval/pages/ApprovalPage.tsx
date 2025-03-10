import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ApprovalPage.css";
import {
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import Layout from "../../../shared/layouts/Layout";

const API_URL = "https://management-claim-request.vercel.app/api";

interface Claim {
  _id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time: number;
  staff_name: string;
  staff_email: string;
  project_info: {
    project_name: string;
    project_code: string;
  };
  role_in_project: string;
  remark?: string;
}

const ApprovalPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState("");
  const [currentClaimId, setCurrentClaimId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<
    "Approved" | "Rejected" | "Returned" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending Approval");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_URL}/claims/approval-search`,
          {
            searchCondition: {
              keyword: "",
              claim_status: "",
              claim_start_date: "",
              claim_end_date: "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 100, // Get more to handle client-side filtering
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setClaims(response.data.data.pageData);
        }
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [token]);

  useEffect(() => {
    // Filter claims based on status and search term
    const filtered = claims.filter((claim) => {
      const matchesStatus =
        statusFilter === "All" || claim.claim_status === statusFilter;
      const matchesSearch =
        claim.claim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (claim.project_info?.project_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    setFilteredClaims(filtered);
    setPage(0); // Reset to first page when filters change
  }, [claims, statusFilter, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprove = (id: string) => {
    setCurrentClaimId(id);
    setCurrentAction("Approved");
    setIsModalOpen(true);
  };

  const handleReject = (id: string) => {
    setCurrentClaimId(id);
    setCurrentAction("Rejected");
    setIsModalOpen(true);
  };

  const handleReturn = (id: string) => {
    setCurrentClaimId(id);
    setCurrentAction("Returned");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    if (currentAction !== "Approved" && !modalReason.trim()) {
      setError("Reason is required for reject or return actions.");
      return;
    }

    if (!currentClaimId || !currentAction) return;

    try {
      const response = await axios.put(
        `${API_URL}/claims/change-status`,
        {
          claim_id: currentClaimId,
          claim_status: currentAction,
          comment: modalReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update the local state to reflect the change
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === currentClaimId
              ? { ...claim, claim_status: currentAction }
              : claim
          )
        );

        setIsModalOpen(false);
        setModalReason("");
        setCurrentClaimId(null);
        setCurrentAction(null);
        setError(null);
      }
    } catch (error) {
      console.error(`Error updating claim status:`, error);
      setError("Failed to update claim status. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalReason("");
    setCurrentClaimId(null);
    setCurrentAction(null);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  return (
    <div
      className={`approval-container ${isModalOpen ? "blur-background" : ""}`}
    >
      <div className="approval-content">
        <h1 className="approval-title">Claim Approval Management</h1>

        <div className="approval-filters">
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
            placeholder="Search by name, requester, project..."
          />

          <FormControl
            variant="outlined"
            size="small"
            className="status-filter"
          >
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Pending Approval">Pending Approval</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Returned">Returned</MenuItem>
            </Select>
          </FormControl>
        </div>

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
            <p>Loading claims...</p>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="no-claims">
            <p>No claims found matching your criteria.</p>
          </div>
        ) : (
          <>
            <TableContainer
              component={Paper}
              className="approval-table-container"
            >
              <Table stickyHeader aria-label="claims table">
                <TableHead>
                  <TableRow>
                    {/* Đã xóa cột ID */}
                    <TableCell>Claim Name</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((claim) => (
                      <TableRow key={claim._id}>
                        {/* Đã xóa cột ID */}
                        <TableCell>{claim.claim_name}</TableCell>
                        <TableCell>
                          {claim.project_info
                            ? `${claim.project_info.project_name} (${claim.project_info.project_code})`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{claim.staff_name}</TableCell>
                        <TableCell>{claim.role_in_project || "N/A"}</TableCell>
                        <TableCell>
                          {formatDate(claim.claim_start_date)}
                        </TableCell>
                        <TableCell>
                          {formatDate(claim.claim_end_date)}
                        </TableCell>
                        <TableCell>{claim.total_work_time}</TableCell>
                        <TableCell>
                          <span
                            className={`status-badge status-${claim.claim_status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {claim.claim_status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {claim.claim_status === "Pending Approval" && (
                            <div className="action-buttons">
                              <button
                                className="approve-button"
                                onClick={() => handleApprove(claim._id)}
                              >
                                Approve
                              </button>
                              <button
                                className="reject-button"
                                onClick={() => handleReject(claim._id)}
                              >
                                Reject
                              </button>
                              <button
                                className="return-button"
                                onClick={() => handleReturn(claim._id)}
                              >
                                Return
                              </button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredClaims.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className="custom-modal"
      >
        <div className="modal-content">
          <h2>
            {currentAction === "Approved"
              ? "Approve Claim"
              : currentAction === "Rejected"
              ? "Reject Claim"
              : "Return Claim"}
          </h2>

          {currentAction !== "Approved" && (
            <>
              <p className="modal-instruction">
                Please provide a reason for this action:
              </p>
              <TextField
                multiline
                rows={4}
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter your reason here..."
                required
              />
            </>
          )}

          {currentAction === "Approved" && (
            <p className="modal-instruction">
              Are you sure you want to approve this claim?
            </p>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <Button
              onClick={handleModalSubmit}
              variant="contained"
              color={
                currentAction === "Approved"
                  ? "success"
                  : currentAction === "Rejected"
                  ? "error"
                  : "warning"
              }
              className="action-button"
            >
              {currentAction === "Approved"
                ? "Approve"
                : currentAction === "Rejected"
                ? "Reject"
                : "Return"}
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              className="cancel-button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ApprovalPage;

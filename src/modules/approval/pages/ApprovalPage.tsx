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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import moment from "moment";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tableCellStyle = {
    borderRight: "2px solid rgba(224, 224, 224, 1)",
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
    "&:last-child": {
      borderRight: "none",
    },
  };

  const headerCellStyle = {
    ...tableCellStyle,
    borderBottom: "2px solid rgba(180, 180, 180, 1)",
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (statusFilter === "All" && token) {
      fetchAllClaims();
    }
  }, [token, statusFilter]);

  const fetchAllClaims = async () => {
    try {
      setLoading(true);

      // Lấy tất cả các status cần thiết
      const statuses = [
        "Pending Approval",
        "Approved",
        "Rejected",
        "Returned",
        "Paid",
      ];
      const allClaimsData: Claim[] = [];

      // First, get the total count for each status
      for (const status of statuses) {
        // Initial request to get total count
        const countResponse = await axios.post(
          `${API_URL}/claims/approval-search`,
          {
            searchCondition: {
              keyword: searchTerm || "",
              claim_status: status,
              claim_start_date: startDate || "",
              claim_end_date: endDate || "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: 1, // Just need to get the total count
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (countResponse.data.success) {
          const totalItems = countResponse.data.data.pageInfo.totalItems;

          // Now fetch all data in one request with the exact page size needed
          if (totalItems > 0) {
            const dataResponse = await axios.post(
              `${API_URL}/claims/approval-search`,
              {
                searchCondition: {
                  keyword: searchTerm || "",
                  claim_status: status,
                  claim_start_date: startDate || "",
                  claim_end_date: endDate || "",
                  is_delete: false,
                },
                pageInfo: {
                  pageNum: 1,
                  pageSize: totalItems, // Use the exact count
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (dataResponse.data.success) {
              allClaimsData.push(...dataResponse.data.data.pageData);
            }
          }
        }
      }

      const filteredData = allClaimsData.filter(
        (claim: Claim) =>
          claim.claim_status !== "Draft" && claim.claim_status !== "Canceled"
      );

      console.log("All claims data:", filteredData);

      setClaims(filteredData);
      setFilteredClaims(filteredData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error("Error fetching all claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 11000); // Đợi 1000ms sau khi người dùng ngừng gõ

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sửa lại useEffect để sử dụng debouncedSearchTerm thay vì searchTerm
  useEffect(() => {
    if (!token) return;
    // Reset pagination when filters change
    setCurrentPage(1);
    setClaims([]);
    fetchClaims(1, true);
  }, [
    token,
    statusFilter,
    debouncedSearchTerm,
    startDate,
    endDate,
    // Remove page and rowsPerPage from here
  ]);

  const fetchClaims = async (pageNum = currentPage, isNewSearch = false) => {
    try {
      setLoading(true);

      // First, get the total count
      const countResponse = await axios.post(
        `${API_URL}/claims/approval-search`,
        {
          searchCondition: {
            keyword: debouncedSearchTerm || "",
            claim_status: statusFilter === "All" ? "" : statusFilter,
            claim_start_date: startDate || "",
            claim_end_date: endDate || "",
            is_delete: false,
          },
          pageInfo: {
            pageNum: 1,
            pageSize: 1, // Just need to get the total count
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (countResponse.data.success) {
        const totalItems = countResponse.data.data.pageInfo.totalItems;
        setTotalCount(totalItems);

        // Now fetch all data in one request
        const response = await axios.post(
          `${API_URL}/claims/approval-search`,
          {
            searchCondition: {
              keyword: debouncedSearchTerm || "",
              claim_status: statusFilter === "All" ? "" : statusFilter,
              claim_start_date: startDate || "",
              claim_end_date: endDate || "",
              is_delete: false,
            },
            pageInfo: {
              pageNum: 1,
              pageSize: totalItems, // Use the exact count
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const filteredData = response.data.data.pageData.filter(
            (claim: Claim) =>
              claim.claim_status !== "Draft" &&
              claim.claim_status !== "Canceled"
          );

          setClaims(filteredData);
          setFilteredClaims(filteredData);

          // Only reset page to 0 for new searches
          if (isNewSearch) {
            setPage(0);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
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
    // Don't reset page here
  }, [claims, statusFilter, searchTerm]);

  useEffect(() => {
    // Chỉ lọc khi không phải All hoặc đã có dữ liệu All
    if (statusFilter !== "All" || claims.length > 0) {
      console.log("Current claims:", claims);

      const filtered = claims.filter((claim) => {
        // Loại bỏ các claim có status là "Draft" hoặc "Canceled"
        if (claim.claim_status === "Draft" || claim.claim_status === "Canceled")
          return false;

        // Khi chọn All, hiển thị tất cả các status
        const matchesStatus =
          statusFilter === "All" || claim.claim_status === statusFilter;

        const matchesSearch =
          !searchTerm ||
          claim.claim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (claim.project_info?.project_name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
      });

      console.log("Filtered claims:", filtered);

      // Log số lượng claim theo từng status sau khi lọc
      const statusCounts = filtered.reduce((acc: any, claim: Claim) => {
        acc[claim.claim_status] = (acc[claim.claim_status] || 0) + 1;
        return acc;
      }, {});
      console.log("Filtered claims by status:", statusCounts);

      setFilteredClaims(filtered);
    }
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

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
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
    if (!currentClaimId || !currentAction) return;

    try {
      const payload = {
        _id: currentClaimId,
        claim_status: currentAction,
        comment: currentAction !== "Approved" ? modalReason : "",
      };

      const response = await axios.put(
        `${API_URL}/claims/change-status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFilteredClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === currentClaimId
              ? { ...claim, claim_status: currentAction }
              : claim
          )
        );

        // Reset modal state
        setIsModalOpen(false);
        setModalReason("");
        setCurrentClaimId(null);
        setCurrentAction(null);
        setError(null);
      }
    } catch (error: any) {
      console.error(`Error updating claim status:`, error);
      setError(
        error.response?.data?.message ||
          "Failed to update claim status. Please try again."
      );
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
      className={`min-h-screen bg-gray-100 ${
        isModalOpen ? "blur-background" : ""
      }`}
    >
      <div className="p-8">
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
                <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>

            <div className="date-filters">
              <TextField
                label="Start Date"
                type="date"
                variant="outlined"
                size="small"
                value={startDate}
                onChange={(e) => handleDateChange("start", e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="date-field"
              />

              <TextField
                label="End Date"
                type="date"
                variant="outlined"
                size="small"
                value={endDate}
                onChange={(e) => handleDateChange("end", e.target.value)}
                InputLabelProps={{ shrink: true }}
                className="date-field"
              />

              {(startDate || endDate) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearDateFilters}
                  sx={{ color: "gray", borderColor: "gray" }}
                >
                  Clear Dates
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="flex justify-center flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.5s]"></div>
              </div>
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
                      <TableCell align="center" sx={headerCellStyle}>
                        Claim Name
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Project
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Requester
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Role
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Start Date
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        End Date
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Times
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={headerCellStyle}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredClaims
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((claim) => (
                        <TableRow key={claim._id}>
                          <TableCell sx={tableCellStyle}>
                            {claim.claim_name}
                          </TableCell>
                          <TableCell sx={tableCellStyle}>
                            {claim.project_info
                              ? `${claim.project_info.project_name} (${claim.project_info.project_code})`
                              : "N/A"}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {claim.staff_name}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {claim.role_in_project || "N/A"}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {formatDate(claim.claim_start_date)}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {formatDate(claim.claim_end_date)}
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            {claim.total_work_time} (hours)
                          </TableCell>
                          <TableCell align="center" sx={tableCellStyle}>
                            <span
                              className={`status-badge status-${claim.claim_status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              {claim.claim_status}
                            </span>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ ...tableCellStyle, minWidth: "250px" }}
                          >
                            {claim.claim_status === "Pending Approval" && (
                              <div className="action-buttons">
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    backgroundColor: "gray",
                                    color: "white",
                                    "&:hover": { backgroundColor: "darkgray" },
                                    mr: 1,
                                  }}
                                  onClick={() => handleApprove(claim._id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  onClick={() => handleReject(claim._id)}
                                  sx={{ mr: 1 }}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    color: "#d97706",
                                    borderColor: "#d97706",
                                  }}
                                  onClick={() => handleReturn(claim._id)}
                                >
                                  Return
                                </Button>
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
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => {
                  const computedFrom = page * rowsPerPage + 1;
                  const computedTo = Math.min((page + 1) * rowsPerPage, count);
                  return `${computedFrom}-${computedTo} of ${count}`;
                }}
                showFirstButton
                showLastButton
              />
            </>
          )}
        </div>

        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            className="bg-gray-300"
            sx={{
              m: 0,
              p: 2,
              position: "relative",
              fontSize: "1.25rem",
            }}
          >
            {currentAction === "Approved"
              ? "Approve Claim"
              : currentAction === "Rejected"
              ? "Reject Claim"
              : "Return Claim"}
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {" "}
            {currentAction !== "Approved" && (
              <>
                <p className="modal-instruction">
                  Please provide a reason for this action:
                </p>
                <TextField
                  multiline
                  rows={6} // Tăng số dòng của TextField
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter your reason here..."
                  required
                  sx={{ mt: 2 }} // Thêm margin top
                />
              </>
            )}
            {currentAction === "Approved" && (
              <p
                className="modal-instruction"
                style={{ marginTop: "40px", fontSize: "1.25rem" }}
              >
                Are you sure you want to approve this claim?
              </p>
            )}
            {error && <p className="error-message">{error}</p>}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            {" "}
            <Button onClick={handleCloseModal} sx={{ color: "gray" }}>
              Cancel
            </Button>
            <Button
              onClick={handleModalSubmit}
              variant="contained"
              sx={{
                backgroundColor: "gray",
                color: "white",
                "&:hover": { backgroundColor: "darkgray" },
                minWidth: "100px", // Tăng độ rộng tối thiểu của button
              }}
            >
              {currentAction === "Approved" ? "Approve" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ApprovalPage;

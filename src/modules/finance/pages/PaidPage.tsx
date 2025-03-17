import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  TablePagination,
  Button,
} from "@mui/material";
import { Search, Download, AttachMoney } from "@mui/icons-material";
import axios from "axios";
import "./PaidPage.css";
import moment from "moment";
import Layout from "../../../shared/layouts/Layout";

interface Claim {
  _id: string;
  claim_name: string;
  staff_name: string;
  project_info: {
    project_name: string;
    project_code: string;
  };
  role_in_project: string;
  total_work_time: number;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  created_at: string;
  updated_at: string;
}

const API_URL = "https://management-claim-request.vercel.app/api";

const PaidPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [token, setToken] = useState("");

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

  const fetchClaims = async () => {
    try {
      setLoading(true);

      // Thêm log để kiểm tra dữ liệu gửi đi
      console.log("Sending request with:", {
        searchCondition: {
          keyword: searchTerm || "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: page + 1,
          pageSize: rowsPerPage,
        },
      });

      const response = await axios.post(
        `${API_URL}/claims/finance-search`,
        {
          searchCondition: {
            keyword: searchTerm || "",
            is_delete: false,
          },
          pageInfo: {
            pageNum: page + 1,
            pageSize: rowsPerPage,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Thêm log để kiểm tra response
      console.log("API Response:", response.data);

      if (response.data.success) {
        setClaims(response.data.data.pageData);
        setTotalCount(response.data.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchClaims();
  }, [token, page, rowsPerPage, searchTerm]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePaid = async (claim: Claim) => {
    try {
      const response = await axios.put(
        `${API_URL}/claims/change-status`,
        {
          _id: claim._id,
          claim_status: "Paid",
          comment: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state to show the change immediately
        setClaims((prevClaims) =>
          prevClaims.map((c) =>
            c._id === claim._id ? { ...c, claim_status: "Paid" } : c
          )
        );
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Failed to mark as paid");
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
          <div className="finance-content">
            <h1 className="finance-title">Finance Claims Management</h1>

            <div className="finance-filters">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-field"
                placeholder="Search by name, requester, project..."
                InputProps={{
                  startAdornment: <Search />,
                }}
              />
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="flex justify-center flex-row gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-4 h-4 rounded-full bg-gray-700 animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            ) : claims.length === 0 ? (
              <div className="no-claims">
                <p>No claims found matching your criteria.</p>
              </div>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  className="finance-table-container"
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
                          Hours
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
                      {claims.map((claim) => (
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
                            sx={{ ...tableCellStyle, minWidth: "200px" }}
                          >
                            <div className="action-buttons">
                              {claim.claim_status === "Approved" && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    backgroundColor: "gray",
                                    color: "white",
                                    "&:hover": { backgroundColor: "darkgray" },
                                  }}
                                  onClick={() => handlePaid(claim)}
                                >
                                  Mark as Paid
                                </Button>
                              )}
                              <Tooltip title="Download">
                                <IconButton color="default">
                                  <Download />
                                </IconButton>
                              </Tooltip>
                            </div>
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
                    const computedTo = Math.min(
                      (page + 1) * rowsPerPage,
                      count
                    );
                    return `${computedFrom}-${computedTo} of ${count}`;
                  }}
                  showFirstButton
                  showLastButton
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaidPage;

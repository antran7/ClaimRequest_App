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
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import {
  Search,
  Download,
  PictureAsPdf,
  TableChart,
  AttachMoney,
} from "@mui/icons-material";
import axios from "axios";
import "./PaidPage.css";
import moment from "moment";
import Layout from "../../../shared/layouts/Layout";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [token, setToken] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("Approved");
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [downloadAllAnchorEl, setDownloadAllAnchorEl] =
    useState<null | HTMLElement>(null);
  const [selectedClaimForDownload, setSelectedClaimForDownload] =
    useState<Claim | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

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
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/claims/search`,
        {
          searchCondition: {
            keyword: debouncedSearchTerm || "",
            claim_status: statusFilter, // Thêm status filter
            claim_start_date: "",
            claim_end_date: "",
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
  }, [token, page, rowsPerPage, debouncedSearchTerm, statusFilter]);

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenConfirmDialog = (claim: Claim) => {
    setSelectedClaim(claim);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedClaim(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        setClaims((prevClaims) =>
          prevClaims.map((c) =>
            c._id === claim._id ? { ...c, claim_status: "Paid" } : c
          )
        );
        setSnackbar({
          open: true,
          message: "Payment processed successfully!",
          severity: "success",
        });
        fetchClaims(); // Refresh the data
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
      setSnackbar({
        open: true,
        message: "Failed to process payment. Please try again.",
        severity: "error",
      });
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const handleDownloadClick = (
    event: React.MouseEvent<HTMLElement>,
    claim: Claim
  ) => {
    setDownloadAnchorEl(event.currentTarget);
    setSelectedClaimForDownload(claim);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
    setSelectedClaimForDownload(null);
  };

  const handleDownloadExcel = () => {
    try {
      if (!selectedClaimForDownload) return;

      // Chuẩn bị dữ liệu cho file Excel
      const data = [
        {
          "Claim Name": selectedClaimForDownload.claim_name,
          Project: selectedClaimForDownload.project_info
            ? `${selectedClaimForDownload.project_info.project_name} (${selectedClaimForDownload.project_info.project_code})`
            : "N/A",
          Requester: selectedClaimForDownload.staff_name,
          Role: selectedClaimForDownload.role_in_project || "N/A",
          "Start Date": formatDate(selectedClaimForDownload.claim_start_date),
          "End Date": formatDate(selectedClaimForDownload.claim_end_date),
          "Total Hours": `${selectedClaimForDownload.total_work_time} hours`,
          Status: selectedClaimForDownload.claim_status,
        },
      ];

      // Tạo worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Tạo workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Claim Details");

      // Download file
      XLSX.writeFile(wb, `claim-${selectedClaimForDownload.claim_name}.xlsx`);

      setSnackbar({
        open: true,
        message: "Excel file downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating Excel:", error);
      setSnackbar({
        open: true,
        message: "Failed to create Excel file. Please try again.",
        severity: "error",
      });
    }
    handleDownloadClose();
  };

  const handleDownloadPDF = () => {
    try {
      if (!selectedClaimForDownload) return;

      // Tạo PDF document với orientation là portrait và đơn vị là pt
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Thêm tiêu đề
      doc.setFontSize(16);
      doc.text("Claim Details", 40, 40);

      // Chuẩn bị dữ liệu cho bảng
      const data = [
        ["Claim Name", selectedClaimForDownload.claim_name],
        [
          "Project",
          selectedClaimForDownload.project_info
            ? `${selectedClaimForDownload.project_info.project_name} (${selectedClaimForDownload.project_info.project_code})`
            : "N/A",
        ],
        ["Requester", selectedClaimForDownload.staff_name],
        ["Role", selectedClaimForDownload.role_in_project || "N/A"],
        ["Start Date", formatDate(selectedClaimForDownload.claim_start_date)],
        ["End Date", formatDate(selectedClaimForDownload.claim_end_date)],
        ["Total Hours", `${selectedClaimForDownload.total_work_time} hours`],
        ["Status", selectedClaimForDownload.claim_status],
      ];

      // Sử dụng autoTable
      autoTable(doc, {
        startY: 60,
        head: [["Field", "Value"]],
        body: data,
        theme: "grid",
        headStyles: {
          fillColor: [128, 128, 128],
          textColor: [255, 255, 255],
        },
        styles: {
          fontSize: 12,
          cellPadding: 8,
        },
        columnStyles: {
          0: { fontStyle: "bold" },
        },
      });

      // Download file
      doc.save(`claim-${selectedClaimForDownload.claim_name}.pdf`);

      setSnackbar({
        open: true,
        message: "PDF file downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to create PDF file. Please try again.",
        severity: "error",
      });
    }
    handleDownloadClose();
  };

  const handleDownloadAllClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAllAnchorEl(event.currentTarget);
  };

  const handleDownloadAllClose = () => {
    setDownloadAllAnchorEl(null);
  };

  // 4. Thêm functions để download all
  const handleDownloadAllExcel = () => {
    try {
      const data = claims.map((claim) => ({
        "Claim Name": claim.claim_name,
        Project: claim.project_info
          ? `${claim.project_info.project_name} (${claim.project_info.project_code})`
          : "N/A",
        Requester: claim.staff_name,
        Role: claim.role_in_project || "N/A",
        "Start Date": formatDate(claim.claim_start_date),
        "End Date": formatDate(claim.claim_end_date),
        "Total Hours": `${claim.total_work_time} hours`,
        Status: claim.claim_status,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "All Claims");
      XLSX.writeFile(wb, `all-claims-${statusFilter.toLowerCase()}.xlsx`);

      setSnackbar({
        open: true,
        message: "Excel file downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating Excel:", error);
      setSnackbar({
        open: true,
        message: "Failed to create Excel file. Please try again.",
        severity: "error",
      });
    }
    handleDownloadAllClose();
  };

  const handleDownloadAllPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      doc.setFontSize(16);
      doc.text(`${statusFilter} Claims Report`, 40, 40);

      const tableData = claims.map((claim) => [
        claim.claim_name,
        claim.project_info
          ? `${claim.project_info.project_name} (${claim.project_info.project_code})`
          : "N/A",
        claim.staff_name,
        claim.role_in_project || "N/A",
        formatDate(claim.claim_start_date),
        formatDate(claim.claim_end_date),
        `${claim.total_work_time} hours`,
        claim.claim_status,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [
          [
            "Claim Name",
            "Project",
            "Requester",
            "Role",
            "Start Date",
            "End Date",
            "Hours",
            "Status",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [128, 128, 128],
          textColor: [255, 255, 255],
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
      });

      doc.save(`all-claims-${statusFilter.toLowerCase()}.pdf`);

      setSnackbar({
        open: true,
        message: "PDF file downloaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to create PDF file. Please try again.",
        severity: "error",
      });
    }
    handleDownloadAllClose();
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
                placeholder="Search by claim name"
                InputProps={{
                  startAdornment: <Search />,
                }}
              />

              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 200, ml: 2 }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="Approved">Approved Claims</MenuItem>
                  <MenuItem value="Paid">Paid Claims</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="small"
                onClick={handleDownloadAllClick}
                sx={{
                  backgroundColor: "gray",
                  color: "white",
                  "&:hover": { backgroundColor: "darkgray" },
                  textTransform: "none",
                  ml: 2,
                }}
                startIcon={<Download />}
              >
                Download All
              </Button>
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
                              {claim.claim_status === "Approved" ? (
                                <Button
                                  variant="contained"
                                  size="medium"
                                  sx={{
                                    backgroundColor: "gray",
                                    color: "white",
                                    "&:hover": { backgroundColor: "darkgray" },
                                    textTransform: "none",
                                    padding: "8px 32px",
                                    fontSize: "14px",
                                    minWidth: "120px",
                                    height: "30px",
                                    width: "100px",
                                  }}
                                  startIcon={<AttachMoney />}
                                  onClick={() => handleOpenConfirmDialog(claim)}
                                >
                                  Paid
                                </Button>
                              ) : (
                                claim.claim_status === "Paid" && (
                                  <Button
                                    variant="contained"
                                    size="medium"
                                    sx={{
                                      backgroundColor: "gray",
                                      color: "white",
                                      "&:hover": {
                                        backgroundColor: "darkgray",
                                      },
                                      textTransform: "none",
                                      padding: "8px 16px",
                                      fontSize: "14px",
                                    }}
                                    startIcon={<Download />}
                                    onClick={(e) =>
                                      handleDownloadClick(e, claim)
                                    }
                                  >
                                    Download
                                  </Button>
                                )
                              )}
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

      {/* Confirm Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{ fontSize: "24px", padding: "20px 24px" }}
        >
          Confirm Payment
        </DialogTitle>
        <DialogContent sx={{ padding: "20px 24px" }}>
          Are you sure you want to mark this claim as paid?
        </DialogContent>
        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button
            onClick={handleCloseConfirmDialog}
            color="primary"
            sx={{ fontSize: "16px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedClaim && handlePaid(selectedClaim)}
            color="primary"
            variant="contained"
            sx={{ fontSize: "16px" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "80px" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Menu
        anchorEl={downloadAnchorEl}
        open={Boolean(downloadAnchorEl)}
        onClose={handleDownloadClose}
      >
        <MenuItem onClick={handleDownloadExcel}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadPDF}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={downloadAllAnchorEl}
        open={Boolean(downloadAllAnchorEl)}
        onClose={handleDownloadAllClose}
      >
        <MenuItem onClick={handleDownloadAllExcel}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download All as Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadAllPDF}>
          <ListItemIcon>
            <PictureAsPdf fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download All as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Layout>
  );
};

export default PaidPage;

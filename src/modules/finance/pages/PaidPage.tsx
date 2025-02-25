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
} from "@mui/material";
import { Search, Download, AttachMoney } from "@mui/icons-material";
import axios from "axios";
import "./PaidPage.css";

interface ClaimRequest {
  id: number;
  employeeName: string;
  projectName: string;
  amount: number;
  status: "APPROVED" | "PAID";
  submittedDate: string;
  approvedDate: string;
}

const PaidPage = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ClaimRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://67b5a06d07ba6e59083db637.mockapi.io/api/requests"
        );
        const approvedRequests = response.data
          .filter(
            (req: any) => req.status === "APPROVED" || req.status === "PAID"
          )
          .map((req: any) => ({
            id: req.id,
            employeeName: `User ${req.userId}`,
            projectName: `Project ${String.fromCharCode(65 + (req.id % 26))}`,
            amount: Math.floor(Math.random() * 10000) + 1000,
            status: req.status,
            submittedDate: req.submittedDate,
            approvedDate: new Date().toISOString().split("T")[0],
          }));
        setData(approvedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handlePaid = async (record: ClaimRequest) => {
    try {
      await axios.put(
        `https://67b5a06d07ba6e59083db637.mockapi.io/api/requests/${record.id}`,
        {
          ...record,
          status: "PAID",
        }
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.id === record.id ? { ...item, status: "PAID" } : item
        )
      );

      alert(`Claim #${record.id} has been marked as paid`);
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Failed to mark as paid");
    }
  };

  const handleDownload = (record: ClaimRequest) => {
    alert(`Downloading claim #${record.id} details...`);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="paid-page">
      <div className="page-header">
        <div className="header-top">
          <Typography variant="h4" className="page-title">
            Finance Claims Management
          </Typography>
        </div>
        <TextField
          placeholder="Search claims..."
          variant="outlined"
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </div>
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Amount ($)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Approved Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.projectName}</TableCell>
                  <TableCell className="amount-cell">
                    ${record.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`status-tag ${
                        record.status === "PAID" ? "paid" : "approved"
                      }`}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <TableCell>{record.submittedDate}</TableCell>
                  <TableCell>{record.approvedDate}</TableCell>
                  <TableCell>
                    <Tooltip title="Mark as Paid">
                      <span>
                        <IconButton
                          color="primary"
                          onClick={() => handlePaid(record)}
                          disabled={record.status === "PAID"}
                        >
                          <AttachMoney />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        color="default"
                        onClick={() => handleDownload(record)}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default PaidPage;

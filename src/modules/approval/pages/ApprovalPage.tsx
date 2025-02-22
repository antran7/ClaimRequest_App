import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  InputAdornment,
  Button,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface RequestData {
  id: string;
  requestName: string;
  requester: string;
  amount: number;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockData: RequestData[] = [
  {
    id: "001",
    requestName: "Equipment Purchase",
    requester: "John Doe",
    amount: 1500,
    submittedDate: "2024-03-15",
    status: "Pending",
  },
  {
    id: "002",
    requestName: "Software License",
    requester: "Jane Smith",
    amount: 2000,
    submittedDate: "2024-03-16",
    status: "Pending",
  },
  // Add more mock data as needed
];

const ApprovalPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [requests] = useState<RequestData[]>(mockData);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredRequests = requests.filter((request) =>
    Object.values(request).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        borderRadius: 0,
        boxShadow: "none",
        margin: 0,
        backgroundColor: "transparent",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 500,
          pl: 0,
        }}
      >
        Pending Requests
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search requests..."
        value={searchQuery}
        onChange={handleSearchChange}
        size="small"
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer sx={{ pl: 0 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Request Name</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Times (Hours)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.requestName}</TableCell>
                    <TableCell>{row.requester}</TableCell>
                    <TableCell align="right">
                      {row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{row.submittedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusChipColor(row.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ pl: 0 }} // Thêm padding-left 0
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ApprovalPage;

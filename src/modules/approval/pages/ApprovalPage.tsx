import { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./ApprovalPage.css";
import { handleLogout } from "../../../shared/utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ClaimRequest {
  id: number;
  name: string;
  submittedDate: string;
  status: string;
  requesterName: string;
  amount: number;
}

const ApprovalPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [requests, setRequests] = useState<ClaimRequest[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://67b5a06d07ba6e59083db637.mockapi.io/api/requests"
        );
        const pendingRequests = response.data
          .filter((req: any) => req.status === "PENDING")
          .map((req: any) => ({
            ...req,
            requesterName: "User " + req.userId,
            amount: Math.floor(Math.random() * 10000) + 1000,
          }));
        setRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (record: ClaimRequest) => {
    try {
      await axios.put(
        `https://67b5a06d07ba6e59083db637.mockapi.io/api/requests/${record.id}`,
        {
          ...record,
          status: "APPROVED",
        }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== record.id)
      );
      message.success(`Request #${record.id} has been approved`);
    } catch (error) {
      console.error("Error approving request:", error);
      message.error("Failed to approve request");
    }
  };

  const handleReject = async (record: ClaimRequest) => {
    try {
      await axios.put(
        `https://67b5a06d07ba6e59083db637.mockapi.io/api/requests/${record.id}`,
        {
          ...record,
          status: "REJECTED",
        }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== record.id)
      );
      message.error(`Request #${record.id} has been rejected`);
    } catch (error) {
      console.error("Error rejecting request:", error);
      message.error("Failed to reject request");
    }
  };

  const columns: ColumnsType<ClaimRequest> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Request Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Requester",
      dataIndex: "requesterName",
      key: "requesterName",
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (
        <span className="amount-cell">${amount.toFixed(2)}</span>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color="gold" className="status-tag">
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record)}
            className="approve-button"
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(record)}
            className="reject-button"
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = requests.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="approval-page">
      <div className="page-header">
        <div className="header-top">
          <h1 className="page-title">Approval Management</h1>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => handleLogout(navigate)}
            danger
            className="logout-button"
          >
            Logout
          </Button>
        </div>
        <Input
          placeholder="Search requests..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </div>
  );
};

export default ApprovalPage;

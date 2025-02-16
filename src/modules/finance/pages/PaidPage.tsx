import { useState, useEffect } from "react";
import { Table, Input, Button, Tag, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  DownloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";
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
    // Lấy dữ liệu từ localStorage và chuyển đổi format
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    const formattedRequests = savedRequests
      .filter((req: any) => req.status === "APPROVED" || req.status === "PAID")
      .map((req: any) => ({
        id: req.id,
        employeeName: req.name || `User ${req.id}`, // Sử dụng tên từ request nếu có
        projectName: `Project ${String.fromCharCode(65 + (req.id % 26))}`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        status: req.status,
        submittedDate: req.submittedDate,
        approvedDate: new Date().toISOString().split("T")[0],
      }));
    setData(formattedRequests);
  }, []);

  const handlePaid = (record: ClaimRequest) => {
    // Cập nhật trong state
    setData((prevData) =>
      prevData.map((item) =>
        item.id === record.id ? { ...item, status: "PAID" } : item
      )
    );

    // Cập nhật trong localStorage
    const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
    const updatedRequests = savedRequests.map((req: any) =>
      req.id === record.id ? { ...req, status: "PAID" } : req
    );
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    message.success(`Claim #${record.id} has been marked as paid`);
  };

  const handleDownload = (record: ClaimRequest) => {
    message.info(`Downloading claim #${record.id} details...`);
    // Implement actual download logic here
  };

  const columns: ColumnsType<ClaimRequest> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      width: 150,
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      width: 150,
    },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount: number) => (
        <span className="amount-cell">${amount.toFixed(2)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag
          color={status === "PAID" ? "green" : "gold"}
          className="status-tag"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
      width: 150,
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          {record.status !== "PAID" && (
            <Button
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => handlePaid(record)}
              className="paid-button"
            >
              Mark as Paid
            </Button>
          )}
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            className="download-button"
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

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
        <h1 className="page-title">Finance Claims Management</h1>
        <Input
          placeholder="Search claims..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
          style={{ width: 300 }}
        />
      </div>
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1300 }}
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

export default PaidPage;

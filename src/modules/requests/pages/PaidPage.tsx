import { useState } from "react";
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

const dummyData: ClaimRequest[] = [
  {
    id: 1,
    employeeName: "Thiên Ân",
    projectName: "Project A",
    amount: 1500,
    status: "APPROVED",
    submittedDate: "2024-02-10",
    approvedDate: "2024-02-12",
  },
  {
    id: 2,
    employeeName: "Jack97",
    projectName: "Project B",
    amount: 5000,
    status: "PAID",
    submittedDate: "2024-02-08",
    approvedDate: "2024-02-11",
  },
  // Add more dummy data as needed
];

const PaidPage = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<ClaimRequest[]>(dummyData);

  const handlePaid = (record: ClaimRequest) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === record.id ? { ...item, status: "PAID" } : item
      )
    );
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
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      filterable: true,
    },
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          className="status-tag"
          color={status === "PAID" ? "green" : "gold"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedDate",
      key: "submittedDate",
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate",
    },
    {
      title: "Actions",
      key: "actions",
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

export default PaidPage;

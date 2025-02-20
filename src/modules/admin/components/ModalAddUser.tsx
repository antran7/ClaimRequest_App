import React, { useState } from 'react';
import UserInfoToAdd from './UserInfoToAdd';
import { Modal } from 'antd';

const ModalAddUser: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button style={{
                  backgroundColor: "green",
                  padding: "6px 18px",
                  border: "none",
                  borderRadius: "5px",
                }} onClick={showModal}>
        + Add
      </button>
      <Modal title="Add User into project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <UserInfoToAdd/>
      </Modal>
    </>
  );
};

export default ModalAddUser;
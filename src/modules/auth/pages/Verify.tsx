import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Preloader from "../../../shared/components/Preloader";
import { resendToken, verifyToken } from "../services/authService";

const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Lấy token từ URL
  console.log(token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setShowModal(true); // Nếu không có token, hiển thị modal
      return;
    }

    const verifyUserToken = async () => {
      try {
        await verifyToken(token);
        navigate("/login"); // Nếu thành công, chuyển về trang chủ
      } catch (error) {
        setShowModal(true); // Nếu thất bại, mở modal nhập email
      } finally {
        setLoading(false);
      }
    };

    // Gọi API sau thời gian preloader ngẫu nhiên (1s - 2s)
    const delay = Math.random() * (2000 - 1000) + 1000;
    setTimeout(verifyUserToken, delay);
  }, [token, navigate]);

  const handleRequestNewToken = async () => {
    try {
      await resendToken(email);
      alert("Vui lòng kiểm tra email để nhận token mới.");
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <>
      {loading && <Preloader />}

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Authentication failed
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please enter email to receive new token:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleRequestNewToken}
          >
            Resend token
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default VerifyPage;
import React, { useEffect, useState } from 'react'
import apiService from '../services/api';
import { useParams } from 'react-router';

function Verify() {
    const { token } = useParams<{ token: string }>();
    const [message, setMessage] = useState<string>("Đang xác minh...");

    useEffect(() => {
        if (!token) {
            setMessage("Token không hợp lệ!");
            return;
        }
        apiService
            .post("/auth/verify-token", { token })
            .then((response) => {
                setMessage("Xác minh thành công!");
            })
            .catch((error) => {
                setMessage("Xác minh thất bại. Vui lòng thử lại!");
            });
    }, [token]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{message}</h2>
        </div>
    )
}

export default Verify

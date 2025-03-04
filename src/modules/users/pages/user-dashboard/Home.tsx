import React, { useState } from "react";
import "./Home.css";
import { LineChart } from "@mui/x-charts/LineChart";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";



import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Tableau10 = [
  "#4e79a7",
  "#f28e2c",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ab",
];

const chartsParams = {
  margin: { bottom: 20, left: 25, right: 5 },
  height: 300,
};

export default function Home() {
  const [color, setColor] = useState("#4e79a7");

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextColor: string | null) => {
    if (nextColor) setColor(nextColor);
  };

  const claimRequestData = {
    labels: ["Pending", "Approved", "Rejected", "Paid"],
    datasets: [
      {
        label: "Claim Requests",
        data: [30, 10, 15, 5],
        backgroundColor: [
          "rgba(99, 232, 255, 0.7)",
          "rgba(54, 235, 136, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(250, 36, 36, 0.7)",
        ],
      },
    ],
  };
  return (
    
    <div className="home">
      <div className="swiper">
        <Swiper
          navigation
          loop
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Navigation, Autoplay, Pagination]}
          className="mySwiper"
        >
          {[
            "https://career.fpt-software.com/wp-content/uploads/2020/07/fville-hanoi.jpg",
            "https://image.baophapluat.vn/w840/Uploaded/2025/vngtsu/2022_05_30/284310238-5510887465596059-5514030432590567305-n-1963.jpg",
            "https://www.hfsresearch.com/wp-content/uploads/HFS-CIP-2024-fpt-software-iot-service-providers-2024-fe.png",
            "https://fpt.com/-/media/project/fpt-corporation/fpt/news/2024/09/fpt-software-wins-job-creation-award-at-esgbusiness-awards-2024.png",
          ].map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`Company Location ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


      <div className="homeWidgets">
        <Stack direction="column" spacing={2} alignItems="center" sx={{ width: "100%" }}>
          <LineChart {...chartsParams} series={[{ data: [15, 23, 18, 19, 13], label: "Example", color }]} />
          <ToggleButtonGroup value={color} exclusive onChange={handleChange}>
            {Tableau10.map((value) => (
              <ToggleButton key={value} value={value} sx={{ p: 1 }}>
                <div
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: value,
                    display: "inline-block",
                  }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <div className="bar-chart">
          <p style={{ textAlign: "center", margin: "20px", fontSize: "20px", color: "#418c9f" }}>
            Claim Request
          </p>
          <Bar data={claimRequestData} />
        </div>
      </div>
    </div>
  );
}

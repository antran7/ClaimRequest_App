import React, { useState } from "react";
import "./UserDashboard.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ClaimRequestData from "./ClaimRequestData";
import PieChartComponent from "./PieChartComponent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Layout from "../../../../shared/layouts/Layout"; // Ensure the correct path



// Register ChartJS components
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

export default function UserDashboard() {
  const [color, setColor] = useState("#4e79a7");

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextColor: string | null) => {
    if (nextColor) setColor(nextColor);
  };

  return (
    <div>
      <Layout>
        <div className="dashboard-container">
          {/* Swiper Slider */}
          <div className="swiper-container">
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
                  <img src={src} alt={`Company Location ${index + 1}`} className="swiper-image" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* PieChartComponent */}
          <div className="chart-wrapper">

            <div className="chart-container ">

              <PieChartComponent />
            </div>

            {/* ClaimRequestData*/}
            <div className="bar-chart">
              <ClaimRequestData />
            </div>
          </div>
        </div>


      </Layout>

    </div>
  );
}

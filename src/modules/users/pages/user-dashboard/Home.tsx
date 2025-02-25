import "./Home.css";
import FeaturedInfo from "../../../users/components/FeaturedInfo/FeaturedInfo";
import Chart from "../../../users/components/chart/Chart";
import WidgetSm from "../../../users/components/WidgetSm/WidgetSm";
import WidgetLg from "../../../users/components/widgetLg/WidgetLg";
import { userData } from "./dumyData"

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";


export default function Home() {
  return (
    <div className="home">
      <div className="swiper">
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay, Pagination]} 
          className="mySwiper"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }} 
        >
        
          {[
            "https://arito.vn/wp-content/uploads/2024/01/Screenshot-2024-01-26-at-10.17.51.png",
            "https://fast.com.vn/wp-content/uploads/2024/05/Quan-ly-la-gi-1.jpg",
            "https://cloudoffice.com.vn/assetmanager/liveEditer/5%20k%C3%BD%20n%C4%83ng%20qu%E1%BA%A3n%20l%C3%BD(1).png",
            "https://callio.vn/wp-content/uploads/2024/02/quan-ly-cong-viec.jpg",
          ].map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`slide-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <FeaturedInfo />
      <Chart data={userData} title="User Analytics" grid dataKey="Active User" />

      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
}

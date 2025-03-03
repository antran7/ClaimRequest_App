import "./Home.css";
import FeaturedInfo from "../../../users/components/FeaturedInfo/FeaturedInfo";
import Chart from "../../../users/components/chart/Chart";
import WidgetSm from "../../../users/components/WidgetSm/WidgetSm";
import WidgetLg from "../../../users/components/widgetLg/WidgetLg";
import { userData } from "./dumyData";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  return (
    <div className="home">
      <div className="backgroud-banner">
        <img src="https://1900.com.vn/storage/uploads/companies/banner/94/129920059-3503629313066805-4741456723758232911-n-1720064347.png" alt="" ></img>
      </div>
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
            "https://career.fpt-software.com/wp-content/uploads/2020/07/fville-hanoi.jpg",
            "https://image.baophapluat.vn/w840/Uploaded/2025/vngtsu/2022_05_30/284310238-5510887465596059-5514030432590567305-n-1963.jpg",
            "https://www.hfsresearch.com/wp-content/uploads/HFS-CIP-2024-fpt-software-iot-service-providers-2024-fe.png",
            "https://fpt.com/-/media/project/fpt-corporation/fpt/news/2024/09/fpt-software-wins-job-creation-award-at-esgbusiness-awards-2024.png",
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

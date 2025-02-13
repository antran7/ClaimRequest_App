

import "./home.css";
import { userData } from "../Home/dumyData";
import FeaturedInfo from "../../FeaturedInfo/FeaturedInfo";
import Chart from "../../chart/Chart";
import WidgetSm from "../../WidgetSm/WidgetSm";
import WidgetLg from "../../widgetLg/WidgetLg";



export default function Home() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart data={userData} title="User Analytics" grid dataKey="Active User"/>
      <div className="homeWidgets">
        
        <WidgetSm/>
        <WidgetLg/>
      </div>
    </div>
  );
}
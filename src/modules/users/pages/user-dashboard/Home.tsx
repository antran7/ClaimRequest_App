import "./Home.css";
import FeaturedInfo from "../../../users/components/FeaturedInfo/FeaturedInfo";
import Chart from "../../../users/components/chart/Chart";
import WidgetSm from "../../../users/components/WidgetSm/WidgetSm";
import WidgetLg from "../../../users/components/widgetLg/WidgetLg";
import { userData } from "./dumyData..d";

export default function Home() {
  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userData}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />    
      </div>
    </div>
  );
}

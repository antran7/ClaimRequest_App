import "./featuredInfo.css";

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function FeaturedInfo() {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">All Post</span>
        <div className="featuredMoneyContainer">
    <span className="featuredMoney">415</span>
          <span className="featuredMoneyRate">
            -11 <ArrowDownwardIcon  className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Post</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">10</span>
          <span className="featuredMoneyRate">
            -1 <ArrowDownwardIcon className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Nember</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">100</span>
          <span className="featuredMoneyRate">
            +2 <ArrowUpwardIcon className="featuredIcon"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
import { Link } from "react-router";
import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import "./Profile.css";
import AdminSidebarVer2 from "../components/AdminSidebarVer2";

function Profile() {

  return (
    <div>
      <Header />
      <div style={{display:"flex"}}>
      <AdminSidebarVer2/>
      <div className="profile">
        <div className="profile-left">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdt3vH3FBrtBEyM7nPk-ZRYRGXthCIr0SvQ&s" alt="" />
          <h3><strong>Nguyen Thi Thuy Ngan</strong></h3>
          <p style={{color:'#70757a'}}>Front End Developer</p>
        </div>
        <div className="profile-right">
          <h2 style={{fontSize:'30px'}}>About me</h2>
          <p style={{color:'#70757a', lineHeight:'30px'}}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci consequatur similique id et, quo nam consectetur, esse nemo vel maxime, eligendi cupiditate dolores necessitatibus? Temporibus delectus odio itaque sed voluptas!</p>
          <p><strong>Staff ID: </strong>SE11180328</p>
          <p><strong>Department: </strong>Information Technology</p>
          <p><strong>Email: </strong>admin@gmail.com</p>
          <button className="btn-change"><Link to="/admin/edit-profile">Edit Profile</Link></button>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

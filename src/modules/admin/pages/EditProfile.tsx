import { Input } from "antd";
import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import "./EditProfile.css";
import AdminSidebarVer2 from "../components/AdminSidebarVer2";
function EditProfile() {
  return (
    <div>
      <Header />
      <div style={{display:"flex"}}>
        <AdminSidebarVer2/>

<div className="profile-edit">

  <div className="edit-profile-left">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdt3vH3FBrtBEyM7nPk-ZRYRGXthCIr0SvQ&s"
      alt=""
    />
  </div>
  <div className="edit-profile-right">
    <div className="input-info">
    <Input placeholder="Full name"/>
    <Input placeholder="Email"/>
    <Input placeholder="Phone"/>
    <Input placeholder="Address"/>
    <Input placeholder="Password"/>
    <Input placeholder="Confirm Password"/>
    <Input placeholder="Department"/>
    <Input placeholder="Describe yourself"/>
    <button className="btn-cancel">Cancel</button>
    <button className="btn-save">Save</button>

    </div>
   
  </div>
</div>
      </div>
     
      <Footer />
    </div>
  );
}

export default EditProfile;

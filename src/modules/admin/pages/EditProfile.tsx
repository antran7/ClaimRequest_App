
import "./EditProfile.css";
import Layout from "../../../shared/layouts/Layout";
import { Input } from "@mui/material";
function EditProfile() {
  return (
    <div>
      <Layout>
        <div style={{ display: "flex" }}>
      

          <div className="profile-edit">
            <div className="edit-profile-left">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdt3vH3FBrtBEyM7nPk-ZRYRGXthCIr0SvQ&s"
                alt=""
              />
            </div>
            <div className="edit-profile-right">
              <div className="input-info">
                <Input placeholder="Full name" />
                <Input placeholder="Email" />
                <Input placeholder="Phone" />
                <Input placeholder="Address" />
                <Input placeholder="Password" />
                <Input placeholder="Confirm Password" />
                <Input placeholder="Department" />
                <Input placeholder="Describe yourself" />
              <div>  <button className="btn-cancel">Cancel</button>
              <button className="btn-save">Save</button></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default EditProfile;

import Footer from "../../../shared/components/Footer";
import Header from "../../../shared/components/Header";
import "./EditProfile.css";
function EditProfile() {
  return (
    <div>
      <Header />
      <div className="profile-edit">
      <div className="edit-profile-left">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvdt3vH3FBrtBEyM7nPk-ZRYRGXthCIr0SvQ&s" alt="" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfile;

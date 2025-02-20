import React from "react";
import"./ProfilePage.css"
import ProfileTab from "../components/ProfileTab";
function ProfilePage() {
  return (
    <div>
      <div className="header-profile">
        <h1>My Profile</h1>
        <ProfileTab/>
      </div>
      
    </div>
  );
}

export default ProfilePage;

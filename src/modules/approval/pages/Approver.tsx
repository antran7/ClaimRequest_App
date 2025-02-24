import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarToday as CalendarTodayIcon,
  LocationSearching as LocationSearchingIcon,
  MailOutline as MailOutlineIcon,
  PermIdentity as PermIdentityIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import "./Approver.css";

export default function Approver() {
  const [formData, setFormData] = useState({
    username: "approver123",
    fullName: "John Doe",
    email: "approver@example.com",
    phone: "0123456789",
    address: "New York, USA",
  });

  const [errors, setErrors] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isFormValid, setIsFormValid] = useState(true);

  const validate = () => {
    let newErrors = {
      username: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
    };
    let isValid = true;

    if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
      isValid = false;
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    setIsFormValid(validate());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      alert("Profile updated successfully!");
      console.log("Updated Data:", formData);
    }
  };

  return (
    <div className="approver">
      <div className="approverTitleContainer">
        <h1 className="approverTitle">Profile Approver</h1>
        <Link to="/newApprover">
          <button className="approverAddButton">Create</button>
        </Link>
      </div>
      <div className="approverContainer">
        <div className="approverShow">
          <div className="approverShowTop">
            <img
              src="https://via.placeholder.com/150"
              alt=""
              className="approverShowImg"
            />
            <div className="approverShowTopTitle">
              <span className="approverShowUsername">{formData.fullName}</span>
              <span className="approverShowUserTitle">Approver</span>
            </div>
          </div>
          <div className="approverShowBottom">
            <span className="approverShowTitle">Account Details</span>
            <div className="approverShowInfo">
              <PermIdentityIcon className="approverShowIcon" />
              <span className="approverShowInfoTitle">{formData.username}</span>
            </div>
            <div className="approverShowInfo">
              <CalendarTodayIcon className="approverShowIcon" />
              <span className="approverShowInfoTitle">01.01.1990</span>
            </div>
            <span className="approverShowTitle">Contact Details</span>
            <div className="approverShowInfo">
              <PhoneAndroidIcon className="approverShowIcon" />
              <span className="approverShowInfoTitle">{formData.phone}</span>
            </div>
            <div className="approverShowInfo">
              <MailOutlineIcon className="approverShowIcon" />
              <span className="approverShowInfoTitle">{formData.email}</span>
            </div>
            <div className="approverShowInfo">
              <LocationSearchingIcon className="approverShowIcon" />
              <span className="approverShowInfoTitle">{formData.address}</span>
            </div>
          </div>
        </div>

        <div className="approverUpdate">
          <span className="approverUpdateTitle">Edit</span>
          <form className="approverUpdateForm" onSubmit={handleSubmit}>
            <div className="approverUpdateLeft">
              <div className="approverUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="approverUpdateInput"
                />
                {errors.username && (
                  <span className="error">{errors.username}</span>
                )}
              </div>
              <div className="approverUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="approverUpdateInput"
                />
                {errors.fullName && (
                  <span className="error">{errors.fullName}</span>
                )}
              </div>
              <div className="approverUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="approverUpdateInput"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="approverUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="approverUpdateInput"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="approverUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="approverUpdateInput"
                />
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </div>
            </div>

            <div className="approverUpdateRight">
              <div className="approverUpdateUpload">
                <img
                  className="approverUpdateImg"
                  src="https://via.placeholder.com/200"
                  alt=""
                />
                <label htmlFor="file">
                  <PublishIcon className="approverUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="approverUpdateButton" disabled={!isFormValid}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

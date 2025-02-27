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
import "./User.css";

export default function User() {
  const [formData, setFormData] = useState({
    staffName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    staffName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    fetch("https://67b416e6392f4aa94fa93e19.mockapi.io/api/user/1")
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          staffName: data.staffName || "",
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const validate = () => {
    let newErrors = {
      staffName: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
    };
    let isValid = true;

    if (formData.staffName.trim().length < 3) {
      newErrors.staffName = "Username must be at least 3 characters.";
      isValid = false;
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch("https://67b416e6392f4aa94fa93e19.mockapi.io/api/user/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Profile updated successfully!");
          console.log("Updated Data:", data);
        })
        .catch((error) => console.error("Error updating user data:", error));
    }
  };

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Profile User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src="https://yt3.googleusercontent.com/YaAFWY03ER0DfF77HAyMqNlRxmJiSEDq_I7ZF0MlcgRcVzOhIhZfB8QlwNhAuVXZesi2I2zy=s900-c-k-c0x00ffffff-no-rj"
              alt=""
              className="userShowImg"
            />
                        <div className="userShowTopTitle">
              <span className="userShowUsername">{formData.fullName}</span>
              <span className="userShowUserTitle">Software Engineer</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.staffName}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <PhoneAndroidIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.phone}</span>
            </div>
            <div className="userShowInfo">
              <MailOutlineIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.email}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearchingIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.address}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm" onSubmit={handleSubmit}>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  type="text"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.staffName && <span className="error">{errors.staffName}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
            </div>
            <button className="userUpdateButton" disabled={!isFormValid}>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

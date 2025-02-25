import { useState, useEffect } from "react";
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
    username: "mixigaming",
    fullName: "Độ Mixi",
    email: "mixigaming@gmail.com",
    phone: "0988888888",
    address: "HaNoi | VN",
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
    let newErrors = { username: "", fullName: "", email: "", phone: "", address: "" };
    let isValid = true;

    if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 10 characters.";
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
    setIsFormValid(validate()); // Validate form whenever data changes
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
              <span className="userShowUsername">Độ Mixi</span>
              <span className="userShowUserTitle">Software Engineer</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentityIcon className="userShowIcon" />
              <span className="userShowInfoTitle">{formData.username}</span>
            </div>
            <div className="userShowInfo">
              <CalendarTodayIcon className="userShowIcon" />
              <span className="userShowInfoTitle">12.9.1989</span>
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
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="userUpdateInput"
                />
                {errors.username && <span className="error">{errors.username}</span>}
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

            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src="https://yt3.googleusercontent.com/YaAFWY03ER0DfF77HAyMqNlRxmJiSEDq_I7ZF0MlcgRcVzOhIhZfB8QlwNhAuVXZesi2I2zy=s900-c-k-c0x00ffffff-no-rj"
                  alt=""
                />
                <label htmlFor="file">
                  <PublishIcon className="userUpdateIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <button className="userUpdateButton" disabled={!isFormValid}>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

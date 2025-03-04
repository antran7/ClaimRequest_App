import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import "./Profile.css";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React from "react";

function Profile() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <div className="profile">
      <div className="head-profile">
        <h2>Your profile</h2>
        <img
          src="https://i.pinimg.com/564x/dd/2d/0a/dd2d0a59ad7e79453110b2968af72d89.jpg"
          alt="Avatar"
          className="avatar-profile"
        />
      </div>
      <div className="input-inf-profile">
        <div className="name-profile">
          <TextField
            required
            label="First Name"
            id="outlined-size-small"
            defaultValue="Enter your first name"
            size="small"
            className="inputname"
          />
          <TextField
            required
            label="Last Name"
            id="outlined-size-small"
            defaultValue="Enter your last name"
            size="small"
            className="inputname"
          />
        </div>
        <div className="gmail-phone">
          <TextField required label="Gmail" id="outlined-size-small" defaultValue="Enter your gmail" size="small" className="input-gmail"/>
          <TextField required label="Phone" id="outlined-size-small" defaultValue="Enter your phone" size="small" className="input-phone"/>
        </div>
        <TextField required label="Address" id="outlined-size-small" defaultValue="Enter your address" size="small" className="input-address"/>

        <div className="input-password-group">
        <FormControl sx={{ width: "100%"}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
          <OutlinedInput className="input-password"
          required
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"} 
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "hide the password" : "display the password"}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        </div>
      </div>
      <div className="action-btn">
        <button className="cancel-btn">Cancel</button>
        <button className="save-btn">Save</button>

      </div>
    </div>
  );
}

export default Profile;

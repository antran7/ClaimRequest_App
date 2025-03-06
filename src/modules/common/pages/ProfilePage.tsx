import React, { useState } from 'react'
import Layout from '../../../shared/layouts/Layout'
import './ProfilePage.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useForm } from 'react-hook-form';
import { Avatar } from '@mui/material';
import { useAuth } from '../../../core/hooks/useAuth';
import { updateInfo } from '../services/userApi';
import toast from 'react-hot-toast';

type FormData = {
  username: string;
  email: string;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const formatDateToUTC7 = (isoString?: string) => {
    return isoString
      ? new Date(isoString).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      : "N/A";
  };

  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateInfo(user?._id, {
        email: data.email, 
        user_name: data.username
      });
      toast("Update successfully.", {
        icon: "✅",
        style: { background: "#333", color: "#ccc" },
      });
    } catch (error) {
      toast(error.toString(), {
        icon: "❌",
        style: { background: "#333", color: "#ccc" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className='profile-page-container'>
        <div className='profile-page-title'>
          <h2>My profile info</h2>
          <small>Welcome to FPT claim portal</small>
        </div>
        <div className='profile-page-content'>
          <div className='profile-page-board'>
            <div className='profile-left-panel'>
              <Avatar
                alt="Remy Sharp"
                className='profile-avatar'
                src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
              />
              <div className='profile-login-session'>
                <h3>My profile</h3>
                <p>
                  Last login 05 Mar 2024 14:36 <br />
                  Windom 11 Pro Ho Chi Minh city (Viet Nam)
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className='update-form'>
                <input
                  defaultValue={user?.user_name}
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Enter username"
                />
                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

                <input
                  type="email"
                  defaultValue={user?.email}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email format',
                    },
                  })}
                  placeholder="Enter email"
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                <div className='activate-info'>
                  <p>Is activate</p>
                  <div></div>
                </div>
                <button type="submit" disabled={isLoading}>Update</button>
              </form>
            </div>
            <div className='profile-right-top-panel'>
              <div className='create-update-title'>
                <h3>Created & Updated</h3>
                <CalendarMonthOutlinedIcon />
              </div>
              <div className='create-update-date'>
                <div>
                  <h4>Created at</h4>
                  <small>{formatDateToUTC7(user?.created_at)}</small>
                </div>
                <div>
                  <h4>Updated at</h4>
                  <small>{formatDateToUTC7(user?.updated_at)}</small>
                </div>
              </div>
            </div>
            <div className='profile-right-bottom-panel'>
              <div className='my-projects-title'>
                <h3>My involved projects</h3>
                {/* Khi sử dụng thay bằng select của mui */}
                <button type='button'>Filter by</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage
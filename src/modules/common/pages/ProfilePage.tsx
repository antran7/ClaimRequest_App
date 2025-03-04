import React from 'react'
import Layout from '../../../shared/layouts/Layout'
import './ProfilePage.css'
import { useForm } from 'react-hook-form';

type FormData = {
  username: string;
  email: string;
};

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
  };

  return (
    <Layout>
      <div className='profile-page-container'>
        <div className='profile-page-title'>
          <h2>My profile info</h2>
          <small>Welcome to FPT claim portal</small>
        </div>
        <div className='profile-page-info'>
          <div className='profile-page-board'>
            <div className='profile-page-left'>
              <img src="https://clipart-library.com/image_gallery2/Donald-Trump-Transparent.png" alt="" />
              <div>
                <h3>My profile</h3>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px', margin: 'auto' }}>
                <div>
                  <label>Username:</label>
                  <input
                    {...register('username', { required: 'Username is required' })}
                    placeholder="Enter username"
                  />
                  {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
                </div>

                <div>
                  <label>Email:</label>
                  <input
                    type="email"
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
                </div>

                <button type="submit">Submit</button>
              </form>
            </div>
            <div className='profile-page-right'></div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage

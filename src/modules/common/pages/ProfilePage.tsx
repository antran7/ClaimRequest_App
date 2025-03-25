import React, { useEffect, useState } from 'react'
import Layout from '../../../shared/layouts/Layout'
import './ProfilePage.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useForm } from 'react-hook-form';
import { Avatar, Button, List, ListItem, ListItemText, Switch } from '@mui/material';
import { updateInfo, updatePassword } from '../services/userApi';
import toast from 'react-hot-toast';
import { getEmployeeInfo } from '../../employee/services/employeeApi';
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import { searchProjectWithData } from '../../admin/services/projectService';

type FormData = {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};

interface EmployeeData {
  "_id": string,
  "user_id": string,
  "job_rank": string,
  "contract_type": string,
  "account": string,
  "address": string,
  "phone": string,
  "full_name": string,
  "avatar_url": string,
  "department_code": string,
  "salary": number,
  "start_date": string,
  "end_date": string,
  "updated_by": string,
  "created_at": string,
  "updated_at": string,
  "is_deleted": boolean,
  "__v": number,
}

interface ProjectData {
  _id: string,
  project_name: string,
  project_code: string,
  project_department: string,
  project_description: string,
  project_status: string,
  project_start_date: string,
  project_end_date: string,
  updated_by: string,
  is_deleted: boolean,
  created_at: string,
  updated_at: string,
  project_comment: string | null,
  project_members: {
    project_code: string,
    user_id: string,
    employee_id: string,
    user_name: string,
    full_name: string,
  }[];
}

const ProfilePage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [myProjects, setMyProjects] = useState<ProjectData[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const formatDateToUTC7 = (isoString?: string) => {
    return isoString
      ? new Date(isoString).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      : "N/A";
  };

  const handleSwitchChange = () => {
    setIsPasswordMode((prev) => !prev);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (isPasswordMode) {
        await updatePassword({
          old_password: data.oldPassword || '',
          new_password: data.newPassword || '',
        });
      } else {
        await updateInfo(user?._id, {
          email: data.email || '',
          user_name: data.username || ''
        });
      }
      toast("Update successfully.", {
        icon: "✅",
      });
      reset();
    } catch (error: any) {
      toast(error.toString(), {
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployee = async () => {
    const response = await getEmployeeInfo(user._id);
    if (response) {
      setEmployee(response);
    }
  }

  const fetchProject = async () => {
    if (!hasMore) return;
    const projectData = {
      searchTerm: "",
      startDate: "",
      endDate: "",
      department: "",
      user_id: user._id,
    }
    try {
      const response = await searchProjectWithData(projectData, pageNum);
      setMyProjects([...myProjects, ...response.pageData]);
      if (response.pageInfo?.totalPages > pageNum) {
        console.log("Co ne troi");
        setPageNum(prevPageNum => prevPageNum + 1);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      toast(error.toString(), {
        icon: "❌",
      });
    }
  }

  useEffect(() => {
    fetchEmployee();
  }, [])

  useEffect(() => {
    fetchProject();
  }, [])

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
              {employee ? (
                <>
                  <Avatar
                    alt="Remy Sharp"
                    className='profile-avatar'
                    src={employee.avatar_url}
                  />
                  <div className='profile-bio'>
                    <h3>{employee.full_name}</h3>
                    <p>{employee.job_rank}</p>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)} className='update-form'>
                    {!isPasswordMode ? (
                      <>
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
                          {user?.is_blocked ? (
                            <div
                              style={{
                                backgroundColor: "#ff002b",
                                boxShadow: "0 0 30px #ff002b, 0 0 60px #ff002b"
                              }}
                            >
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "#00ffcc",
                                boxShadow: "0 0 30px #00ffcc, 0 0 60px #00ffcc",
                              }}
                            >
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="password"
                          {...register('oldPassword', { required: 'Old password is required' })}
                          placeholder="Enter old password"
                        />
                        {errors.oldPassword && <p style={{ color: 'red' }}>{errors.oldPassword.message}</p>}

                        <input
                          type="password"
                          {...register('newPassword', { required: 'New password is required' })}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword.message}</p>}
                        <div className='activate-info'>
                          <p>Is activate</p>
                          {user?.is_blocked ? (
                            <div
                              style={{
                                backgroundColor: "#ff002b",
                                boxShadow: "0 0 30px #ff002b, 0 0 60px #ff002b"
                              }}
                            >
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: "#00ffcc",
                                boxShadow: "0 0 30px #00ffcc, 0 0 60px #00ffcc",
                              }}
                            >
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    <button type="submit" disabled={isLoading}>
                      {isPasswordMode ? "Update Password" : "Update Profile"}
                    </button>
                  </form>
                  <div className="switch-container">
                    <span>Update Profile</span>
                    <Switch
                      checked={isPasswordMode}
                      onChange={handleSwitchChange}
                      color="secondary"
                    />
                    <span>Update Password</span>
                  </div>
                </>
              ) : (
                <div className='left-panel-loading'>
                  <Skeleton circle width={250} height={250} style={{ margin: "20px 0" }} />
                  <Skeleton height={45} width={525} />
                  <Skeleton height={145} width={525} style={{ margin: "40px 0 10px" }} />
                  <Skeleton height={44} width={196} style={{ marginBottom: "20px" }} />
                  <Skeleton height={38} width={310} />
                </div>
              )}
            </div>
            <div className='profile-right-top-panel'>
              <div className='profile-information-title'>
                {employee ? (
                  <>
                    <h3>Profile Information</h3>
                    <CalendarMonthOutlinedIcon />
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}>
                    <Skeleton height={20} width={175} />
                    <Skeleton height={20} width={20} />
                  </div>
                )}
              </div>
              <div className='profile-information-content'>
                {employee ? (
                  <div className='profile-information'>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <div style={{ width: "50%" }}>
                        <label>Phone number:</label>
                        <input
                          value={employee.phone || ''}
                          readOnly
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <label>Salary:</label>
                        <input
                          value={employee.salary || ''}
                          readOnly
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <div style={{ width: "50%" }}>
                        <label>Start date:</label>
                        <input
                          value={formatDateToUTC7(employee.start_date) || ''}
                          readOnly
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div style={{ width: "50%" }}>
                        <label>End date:</label>
                        <input
                          value={formatDateToUTC7(employee.end_date) || ''}
                          readOnly
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label>Address:</label>
                      <input
                        value={employee.address || ''}
                        readOnly
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <Skeleton height={60} width={270} />
                      <Skeleton height={60} width={270} />
                    </div>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <Skeleton height={60} width={270} />
                      <Skeleton height={60} width={270} />
                    </div>
                    <Skeleton height={60} width={570} />
                  </div>
                )}
              </div>
            </div>
            <div className='profile-right-bottom-panel'>
              <div className='my-projects-title'>
                {employee ? (
                  <>
                    <h3>My involved projects</h3>
                    <button type='button'>Filter by</button>
                  </>
                ) : (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}>
                    <Skeleton height={20} width={190} />
                    <Skeleton height={30} width={100} />
                  </div>
                )}
              </div>
              <div id='projectsScrollDiv' className='my-projects-list'>
                <InfiniteScroll
                  dataLength={myProjects.length}
                  next={fetchProject}
                  hasMore={hasMore}
                  loader={
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "20px",
                      width: "100%",
                    }}>
                      <Skeleton height={40} width="100%" />
                      <Skeleton height={40} width="100%" />
                      <Skeleton height={40} width="100%" />
                      <Skeleton height={40} width="100%" />
                    </div>
                  }
                  endMessage={
                    <p style={{ textAlign: "center", marginTop: 10 }}>
                      Đã hiển thị tất cả project
                    </p>
                  }
                  scrollableTarget="projectsScrollDiv"
                >
                  <List>
                    {myProjects.map((project: ProjectData, index: number) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={project.project_name}
                          secondary={`Code: ${project.project_code}`}
                        />
                        <Button className='view-project-btn'>View detail</Button>
                      </ListItem>
                    ))}
                  </List>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  )
}

export default ProfilePage
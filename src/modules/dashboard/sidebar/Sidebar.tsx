import React from 'react'
import './Sidebar.css'
import { LineStyle as LineStyleIcon, Timeline as TimelineIcon, TrendingUp as TrendingUpIcon, Person as PersonIcon, Report as ReportIcon, AdminPanelSettings as AdminPanelSettingsIcon, AssignmentInd as AssignmentIndIcon, RequestPage as RequestPageIcon } from '@mui/icons-material';



export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <LineStyleIcon className="sidebarIcon" />
                            Home
                        </li>
                        <li className="sidebarListItem">
                            <TimelineIcon className="sidebarIcon" />
                            Analytics
                        </li>
                        <li className="sidebarListItem">
                            <TrendingUpIcon className="sidebarIcon" />
                            Post
                        </li>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Quick Menu</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            
                            <PersonIcon className="sidebarIcon" />
                            Users
                        </li>
                        <li className="sidebarListItem">
                            <AssignmentIndIcon className="sidebarIcon" />
                            Profile
                        </li>
                        <li className="sidebarListItem">
                            <RequestPageIcon className="sidebarIcon" />
                            Request
                        </li>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Staff</h3>
                    <ul className="sidebarList">
                        <li className="sidebarListItem">
                            <AdminPanelSettingsIcon className="sidebarIcon" />
                            Admin
                        </li>
                        <li className="sidebarListItem">
                            <TimelineIcon className="sidebarIcon" />
                            Analytics
                        </li>
                        <li className="sidebarListItem">
                            <ReportIcon className="sidebarIcon" />
                            Reports
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}



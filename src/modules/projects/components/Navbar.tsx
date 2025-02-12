import React from 'react'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router';

const Navbar = () => {
    return (
        <div>
            <div>
                <div className='pb-7 border-b-2 border-gray-500'>
                    <Link to={"/"}>
                        <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="200" height="60" />
                            <text x="50" y="40" fontFamily="Arial, sans-serif" fontSize="24" fill="black" fontWeight="bold">Over</text>
                            <text x="110" y="40" fontFamily="Arial, sans-serif" fontSize="24" fill="black">Track</text>
                            <circle cx="30" cy="30" r="10" fill="#3dcaff" stroke="gray" strokeWidth="4" />
                            <polygon points="30,15 35,30 25,30" fill="#3dcaff" />
                        </svg>
                    </Link>
                </div>
                <ul className=" mt-6 w-full flex flex-col gap-2">
                    <li
                        className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap"
                    >
                        <button
                            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-gray-100 hover:shadow-inner focus:bg-gradient-to-r from-gray-400 to-gray-600 focus:text-white text-gray-700 transition-all ease-linear"
                        >
                            <SpaceDashboardOutlinedIcon />
                            Dashboard
                        </button>
                    </li>
                    <li
                        className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap"
                    >
                        <button
                            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-gray-100 hover:shadow-inner focus:bg-gradient-to-r from-gray-400 to-gray-600 focus:text-white text-gray-700 transition-all ease-linear"
                        >
                            <SettingsOutlinedIcon />
                            Settings
                        </button>
                    </li>
                    <li
                        className="flex-center cursor-pointer p-16-semibold w-full whitespace-nowrap"
                    >
                        <button
                            className="p-16-semibold flex size-full gap-4 p-4 group font-semibold rounded-full bg-cover hover:bg-gray-100 hover:shadow-inner focus:bg-gradient-to-r from-gray-400 to-gray-600 focus:text-white text-gray-700 transition-all ease-linear"
                        >
                            <LogoutIcon />
                            Logout
                        </button>
                    </li>
                </ul>
                <div className="mt-auto">
                <button className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition">
                    <PersonIcon />
                    Profile
                </button>
            </div>
            </div>
        </div>
    )
}

export default Navbar

import Home from "./pages/Home/Home";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import "./UserDashboard.css";
import { Routes, Route } from "react-router-dom"; // Removed BrowserRouter



function UserDashboard(): JSX.Element {
    return (
        <>
            <Topbar />
            <div className="container">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/users" element={<UserList />} /> */}
                </Routes>
                <Routes>

                </Routes>
            </div>
        </>
    );
}

export default UserDashboard;


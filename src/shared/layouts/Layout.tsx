import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
      const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
    

    return (
        <div className="flex min-h-screen">
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className="flex-1 flex flex-col">
                <Header toggleSidebar={toggleSidebar}/>

                <main className="flex-1 p-4 bg-white">{children}</main>
                <Footer />
            </div>
        </div>
    )
}

export default Layout
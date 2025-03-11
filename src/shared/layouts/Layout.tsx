import React, { useCallback, useState } from 'react'
import Header from '../components/Header'
import SideBar from '../components/SideBar';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);


    return (
        <div className="flex min-h-screen">
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 bg-white">{children}</main>
            </div>
        </div>
    )
}

export default Layout
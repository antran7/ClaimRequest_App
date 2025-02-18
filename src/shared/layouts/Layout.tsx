import React from 'react'
import Header from './Header'
import SideBar from './SideBar'
import Footer from './Footer';

type AdminLayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<AdminLayoutProps> = ({children}) => {
    return (
        <>
        <div>
            <SideBar />
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
        </>
    )
}

export default Layout
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar
            <Sidebar /> */}

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 p-4 bg-white">{children}</main>
                <Footer />
            </div>
        </div>
    )
}

export default Layout
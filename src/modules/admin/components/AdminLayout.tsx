import * as React from 'react';
import AdminHeaderDashboard from './AdminHeaderDashboard';
import AdminSidebarDashboard from './AdminSidebarDashboard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div >
      <AdminSidebarDashboard isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div >
        <AdminHeaderDashboard toggleSidebar={toggleSidebar} />
        <div style={{ flex: 1, paddingTop: '80px' }}>


          {children}
        </div>
      </div>
    </div>
  );
}

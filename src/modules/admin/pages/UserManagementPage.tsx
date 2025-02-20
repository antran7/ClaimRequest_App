import AdminLayout from '../components/AdminLayout';
import UserTable from '../components/UserTable';
import"./UserManagementPage.css"
export default function UserManagementPage() {
  return (
    <AdminLayout>
      <div className='usermanagement-container'>
        <h3>User Management</h3>
        <UserTable/>
      </div>
    </AdminLayout>
  );
}

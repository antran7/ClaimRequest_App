import Footer from '../../../shared/components/Footer'
import Header from '../../../shared/components/Header'
import AdminSidebarVer2 from './AdminSidebarVer2'
import { Outlet } from 'react-router'

function LayoutAdmin() {
  return (
    <div>
      <Header/>
      <div style={{display:"flex"}}>
        <AdminSidebarVer2/>
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default LayoutAdmin

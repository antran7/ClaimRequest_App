import AdminLayout from "../components/AdminLayout"
import ProjectTable from "../components/ProjectTable"

function ProjectManagement() {
  return (
    <div>
      <AdminLayout>
        <div className="project-container" style={{
          margin: '20px',
          boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>Project Management</h3>
        <ProjectTable/>
        </div>
      </AdminLayout>
    </div>
  )
}

export default ProjectManagement

import Table from '@mui/joy/Table';

function createData(
  projectName: string,
  createDate: Date,
  endDate: Date,

) {
  return { projectName, createDate, endDate};
}

const rows = [
  createData('Frozen yoghurt', new Date('2023-01-01'), new Date('2023-06-01')),
  createData('Ice cream sandwich', new Date('2023-02-01'), new Date('2023-07-01')),
  createData('Eclair', new Date('2023-03-01'), new Date('2023-08-01')),
  createData('Cupcake', new Date('2023-04-01'), new Date('2023-09-01')),
  createData('Gingerbread', new Date('2023-05-01'), new Date('2023-10-01')),
];


export default function ProjectTable() {
  return (
    <Table hoverRow>
      <thead>
        <tr>
          <th style={{ width: '40%' }}>Project</th>
          <th>Create Date</th>
          <th>End Date</th>
          <th>Add User</th>
          <th>Action</th>

        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.projectName}>
            <td>{row.projectName}</td>
            <td>{row.createDate.toLocaleDateString()}</td>
            <td>{row.endDate.toLocaleDateString()}</td>            
            <td><button
                className="btn-adduser"
                style={{
                  backgroundColor: "green",
                  padding: "6px 18px",
                  border: "none",
                  borderRadius: "5px",
                }}
              > + Add
              </button></td>
              <td><button
                className="btn-edit"
                style={{
                  backgroundColor: "blue",
                  padding: "6px 18px",
                  border: "none",
                  borderRadius: "5px",
                }}
              > Edit
              </button>
              <button
                className="btn-delete"
                style={{
                  backgroundColor: "red",
                  padding: "6px 18px",
                  border: "none",
                  borderRadius: "5px",
                }}
              > Delete
              </button></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

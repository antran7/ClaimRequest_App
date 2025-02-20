import Table from "@mui/joy/Table";

function createData(name: string, calories: number, fat: number, carbs: number, protein: number, phone: string, salary: number) {
  return { name, calories, fat, carbs, protein, phone, salary };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.9, "1234567890", 10000000),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, "0987654321", 20000000),
  createData("Eclair", 262, 16.0, 24, 6.0, "1111111111", 30000000),
  createData("Cupcake", 305, 3.7, 67, 4.3, "2222222222", 40000000),
  createData("Gingerbread", 356, 16.0, 49, 3.9, "3333333333", 50000000),
];

export default function UserTable() {
  return (
    <Table hoverRow>
      <thead>
        <tr>
          <th style={{ width: "20%" }}>Full Name</th>
          <th>Date of birth</th>
          <th>Role</th>
          <th>Adress</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Salary</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.calories}</td>
            <td>{row.fat}</td>
            <td>{row.carbs}</td>
            <td>{row.protein}</td>
            <td>{row.phone}</td>
            <td>{row.salary}</td>
            <td>
              <button
                className="btn-lock"
                style={{
                  backgroundColor: "yellow",
                  padding: "5px 20px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Lock
              </button>
              <button
                className="btn-edit"
                style={{
                  backgroundColor: "blue",
                  padding: "5px 20px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

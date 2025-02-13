import { FaBars } from "react-icons/fa";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <div className="bg-white p-4 shadow-md flex items-center">
      <FaBars className="text-2xl cursor-pointer md:hidden" onClick={toggleSidebar} />
      <h1 className="ml-4 text-xl font-bold">Dashboard</h1>
    </div>
  );
};

export default Navbar;

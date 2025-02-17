
import { Link, useNavigate } from "react-router-dom";



const HomePage = () => {
  const navigate = useNavigate();
  return (
    <header
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-white relative"
      style={{
        backgroundImage:
          "url('https://resources.owllabs.com/hubfs/Blog%20Images/Stock/Remote/Remote-2793651_1152px.jpg')",
      }}
    >
      {/* Logo & Navbar */}
      <div className="absolute top-5 left-5">
        <img
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Logo"
          className="w-24"
        />
      </div>

      <nav className="absolute top-5 right-5 flex gap-6 text-lg font-semibold font-[Darumadrop_One]  ">
        <Link to="/homePage" className="hover:text-gray-300">Home</Link>
        <Link to="/about" className="hover:text-gray-300">About</Link>
        <Link to="/contact" className="hover:text-gray-300">Contact</Link>
      </nav>

      {/* Main Content */}
      <div className="text-center font-[Darumadrop_One]">
        <h1 className="text-9xl font-bold ">OverTrack</h1>
        <p className="mt-3 text-lg">Manage your working overtime easily</p>
        <button className="mt-5 w-40 h-10 bg-amber-950 
         hover:bg-indigo-700 text-white text-xl rounded-xl shadow-lg border-4 border-blue-200"
          onClick={() => navigate("/login")} >
          Sign in now

        </button>
      </div>
    </header>
  );
};

export default HomePage;

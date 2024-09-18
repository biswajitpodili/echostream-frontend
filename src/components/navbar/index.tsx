import { PlayCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
//import { Button } from "../ui/button";

const NavBar = () => {
  return (
    <nav className="h-[10vh] px-8 flex flex-row justify-between items-center">
      {/* Logo Section */}
      <div className="font-extrabold text-[1.5rem]">
        <Link to="/">
          <h2 className="font-Poppins flex flex-row justify-between items-center cursor-pointer">
            <PlayCircleIcon size={24} className="text-red-400 mr-1" />
            <span className="text-zinc-400">Echo</span>
            <span className="text-red-400">Stream</span>
          </h2>
        </Link>
      </div>
      {/* Navbar content */}
      <ul className="max-md:hidden font-Mukta font-medium text-xl">
        <li className="mx-4 inline-block cursor-pointer hover:text-red-400">
          Home
        </li>
        <li className="mx-4 inline-block cursor-pointer hover:text-red-400">
          About
        </li>
        <li className="mx-4 inline-block cursor-pointer hover:text-red-400">
          Contact
        </li>
        <li className="mx-4 inline-block cursor-pointer hover:text-red-400">
          FAQ
        </li>
      </ul>
      {/* Buttons */}
      {/* <div className="flex gap-3">
        
        <Button variant={"ghost"} >Login</Button>
        <Button variant={"secondary"}>Sign up</Button>
      </div> */}
    </nav>
  );
};

export default NavBar;

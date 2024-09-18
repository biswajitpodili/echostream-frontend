import { Link } from "react-router-dom";
import heroImage from "../../../assets/hero1.png";
import { Button } from "../../ui/button";

const Hero = () => {
  return (
    <div className="h-[90vh] flex flex-row justify-between px-12 items-center gap-20">
      <div className="flex flex-col justify-center  gap-6 w-full">
        <h1 className="text-8xl font-semibold">Create, Share, Inspire!</h1>
        <p className="w-[80%] font-Mukta text-xl font-normal ml-1">
          Discover a vibrant platform where you can upload, share, and explore
          videos that inspire, entertain, and connect communities.
        </p>
        <div className="flex gap-3 mt-4">
          <Button size={"lg"}>
            <Link to={"/signup"}>Getting Started</Link>
          </Button>
          <Button size={"lg"} variant={"outline"}>
            <Link to={"/login"}>Login</Link>
          </Button>
        </div>
      </div>
      <img className="w-[30rem]" src={heroImage} alt="heroImage" />
    </div>
  );
};

export default Hero;

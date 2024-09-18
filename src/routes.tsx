import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/landingPage";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";

const RoutesContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default RoutesContainer;

import { Routes, Route } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "@/pages/dashboard/Home";
import LoginPage from "./pages/auth/LoginPage";
import UserProfile from "./pages/dashboard/UserProfile";
import { useAuth } from "./context/useAuth";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route
          path="/streaming/live-streaming"
          element={<div>Live Streaming Page</div>}
        />
        <Route
          path="/streaming/subscriptions"
          element={<div>Subscriptions Page</div>}
        />
        <Route path="/videos/playlists" element={<div>Playlists Page</div>} />
        <Route
          path="/videos/watch-later"
          element={<div>Watch Later Page</div>}
        />
        <Route
          path="/videos/liked-videos"
          element={<div>Liked Videos Page</div>}
        />
        <Route path="/videos/history" element={<div>History Page</div>} />
        <Route
          path="/channel/upload-video"
          element={<div>Upload Video Page</div>}
        />
        <Route
          path="/channel/your-videos"
          element={<div>Your Videos Page</div>}
        />
        <Route
          path="/channel/your-subscribers"
          element={<div>Your Subscribers Page</div>}
        />
        <Route
          path="/channel/video-engagements"
          element={<div>Video Engagements Page</div>}
        />
        <Route
          path="/channel/settings"
          element={<div>Channel Settings Page</div>}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

import { useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "@/pages/dashboard/Home";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import UserProfile from "./pages/dashboard/UserProfile";
import { useAuth } from "./context/useAuth";
import UploadVideo from "./pages/videos/UploadVideo";
import WatchVideo from "./pages/videos/WatchVideo";
import WatchHistory from "./pages/videos/WatchHistory";
import LikedVideos from "./pages/videos/LikedVideos";
import YourVideos from "./pages/channel/YourVideos";
import YourSubscribers from "./pages/channel/YourSubscribers";
import ChannelPage from "./pages/channel/ChannelPage";
import ChannelSearch from "./pages/channel/ChannelSearch";
import Subscriptions from "./pages/streaming/Subscriptions";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const RequireAuth = ({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

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

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/profile"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <UserProfile />
              </RequireAuth>
            }
          />
          <Route path="/watch/:videoId" element={<WatchVideo />} />
          <Route
            path="/streaming/live-streaming"
            element={<div>Live Streaming Page</div>}
          />
          <Route
            path="/streaming/subscriptions"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <Subscriptions />
              </RequireAuth>
            }
          />
          <Route path="/videos/playlists" element={<div>Playlists Page</div>} />
          <Route
            path="/videos/watch-later"
            element={<div>Watch Later Page</div>}
          />
          <Route
            path="/videos/liked-videos"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <LikedVideos />
              </RequireAuth>
            }
          />
          <Route
            path="/videos/history"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <WatchHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/channel/upload-video"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <UploadVideo />
              </RequireAuth>
            }
          />
          <Route
            path="/channel/your-videos"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <YourVideos />
              </RequireAuth>
            }
          />
          <Route
            path="/channel/your-subscribers"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <YourSubscribers />
              </RequireAuth>
            }
          />
          <Route
            path="/channel/:username"
            element={<ChannelPage />}
          />
          <Route
            path="/channel-search"
            element={<ChannelSearch />}
          />
          <Route
            path="/channel/video-engagements"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <div>Video Engagements Page</div>
              </RequireAuth>
            }
          />
          <Route
            path="/channel/settings"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <div>Channel Settings Page</div>
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;

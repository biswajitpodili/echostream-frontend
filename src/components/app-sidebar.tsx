import { Home, Star, Search, Heart, Clock, Upload, Video, Users, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { FaStream } from "react-icons/fa";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/context/useAuth";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  requiresAuth: boolean;
}

const data = {
  navMain: [
    {
      title: "Navigation",
      items: [
        {
          title: "Home",
          url: "/",
          icon: Home,
          requiresAuth: false,
        },
        {
          title: "Search Creators",
          url: "/channel-search",
          icon: Search,
          requiresAuth: false,
        },
        {
          title: "Subscriptions",
          url: "/streaming/subscriptions",
          icon: Star,
          requiresAuth: true,
        },
        
        {
          title: "Profile",
          url: "/profile",
          icon: Users,
          requiresAuth: true,
        },
      ] as NavItem[],
    },
    {
      title: "Content",
      items: [
        {
          title: "Liked Videos",
          url: "/videos/liked-videos",
          icon: Heart,
          requiresAuth: true,
        },
        {
          title: "History",
          url: "/videos/history",
          icon: Clock,
          requiresAuth: true,
        },
      ] as NavItem[],
    },
    {
      title: "Manager",
      items: [
        {
          title: "Upload Video",
          url: "/channel/upload-video",
          icon: Upload,
          requiresAuth: true,
        },
        {
          title: "Your Videos",
          url: "/channel/your-videos",
          icon: Video,
          requiresAuth: true,
        },
        {
          title: "Your Subscribers",
          url: "/channel/your-subscribers",
          icon: Users,
          requiresAuth: true,
        },
      ] as NavItem[],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const [lockedTarget, setLockedTarget] = React.useState<{ url: string; title: string } | null>(null);

  const handleLockedItemClick = (url: string, title: string) => {
    setLockedTarget({ url, title });
    setLoginDialogOpen(true);
  };

  const handleConfirmLogin = () => {
    if (!lockedTarget) return;
    setLoginDialogOpen(false);
    navigate("/login", { state: { from: lockedTarget.url } });
  };

  return (
    <>
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-20 border-b">
        <div className="flex items-center px-4 h-full">
          <a
            href="#"
            className="group relative inline-flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-r from-sidebar-primary via-sidebar-primary/90 to-sidebar-primary/80 px-3.5 py-2.5 text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/35"
          >
            <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/15 blur-2xl" />
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110">
              <FaStream className="h-4 w-4" />
            </span>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-black tracking-[0.03em]">Echo <span className="hidden sm:inline">Stream</span></span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">Video Platform</span>
            </div>
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="font-semibold text-stone-600">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isLocked = item.requiresAuth && !isAuthenticated;

                  return (
                    <SidebarMenuItem key={item.title}>
                      {isLocked ? (
                        <SidebarMenuButton
                          onClick={() => handleLockedItemClick(item.url, item.title)}
                          title="Login required"
                          className="opacity-65"
                        >
                          <IconComponent size={18} />
                          <span>{item.title}</span>
                          <Lock size={14} className="ml-auto" />
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton asChild isActive={item.url === pathname}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <IconComponent size={18} />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border h-16 border-t flex justify-center items-center">
        {isAuthenticated ? (
          <Button onClick={logout} className="w-full">
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/login", { state: { from: pathname } })}
            className="w-full"
          >
            Login
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <AlertDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login Required</AlertDialogTitle>
          <AlertDialogDescription>
            {lockedTarget?.title || "This section"} is available only after login. Continue to login?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmLogin}>Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

import { Command } from "lucide-react";

import * as React from "react";

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
import { Link, useLocation } from "react-router";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Streaming",
      url: "#",
      items: [
        {
          title: "Home",
          url: "/",
        },
        {
          title: "Live Streams",
          url: "/streaming/live-streaming",
        },
        {
          title: "Subscriptions",
          url: "/streaming/subscriptions",
        },
      ],
    },
    {
      title: "Videos Management",
      url: "#",
      items: [
        {
          title: "Playlists",
          url: "/videos/playlists",
        },
        {
          title: "Watch later",
          url: "/videos/watch-later",
        },
        {
          title: "Liked videos",
          url: "/videos/liked-videos",
        },
        {
          title: "History",
          url: "/videos/history",
        },
      ],
    },
    {
      title: "Channel Management",
      url: "#",
      items: [
        {
          title: "Upload a Video",
          url: "/channel/upload-video",
        },
        {
          title: "Your Videos",
          url: "/channel/your-videos",
          isActive: true,
        },
        {
          title: "Your Subscribers",
          url: "/channel/your-subscribers",
        },
        {
          title: "Video Engagements",
          url: "/channel/video-engagements",
        },
        {
          title: "Channel Settings",
          url: "/channel/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const [navData, setNavData] = React.useState(data);

   React.useEffect(() => {
    const updatedNavData = {
      ...navData,
      navMain: navData.navMain.map((group) => ({
        ...group,
        items: group.items.map((navItem) => ({
          ...navItem,
          isActive: navItem.url === pathname,
        })),
      })),
    };

    setNavData(updatedNavData);
  }, [pathname]);


  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <div className="flex items-center justify-between px-4 h-full">
          <a href="#" className="flex items-center gap-2 flex-row">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">EchoStream</span>
              <span className="truncate text-xs">Video Streaming</span>
            </div>
          </a>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="font-semibold text-stone-600">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border h-16 border-t flex justify-center items-center">
        <Button className="w-full">
          <a href={"#"}>Logout</a>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";

export default function DashboardLayout() {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/150",
  };

  const { pathname } = useLocation();

  const [group, setGroup] = useState("");
  const [item, setItem] = useState("");

  useEffect(() => {
    const subGroup = pathname.split("/")[1];
    const item = pathname.split("/")[2];

    setGroup(subGroup);
    setItem(item);
  }, [pathname]);

  console.log("Current sub-group:", group);
  console.log("Current item:", item);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {group?.split("/").pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Dashboard'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {item?.split("/").pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Home'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-row items-center gap-4 justify-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <Search
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  stroke="currentColor"
                  fill="none"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-accent p-2 rounded-full cursor-pointer">
                    <User className="h-5 w-5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={"bottom"}
                  align="end"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user.name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

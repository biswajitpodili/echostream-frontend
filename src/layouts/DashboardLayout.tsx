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
  LogIn,
  LogOut,
  Search,
  UserPlus,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/context/useAuth";

export default function DashboardLayout() {
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const user = {
    name: authUser?.fullname || "Not signed in",
    email: authUser?.email || "Sign in to access your account",
    avatar: authUser?.avatar || "https://via.placeholder.com/150",
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-[100] flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:flex-nowrap sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="min-w-0 flex-nowrap">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {group?.split("/").pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Dashboard'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="block max-w-[38vw] truncate sm:max-w-none">
                    {item?.split("/").pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Home'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex w-auto items-center justify-end gap-2 sm:gap-4">
            <div className="hidden items-center gap-4 md:flex">
              <div className="relative w-44 lg:w-56">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md border bg-background py-2 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <Search
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  stroke="currentColor"
                  fill="none"
                />
              </div>
            </div>

            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-accent p-2 rounded-full cursor-pointer">
                    <UserIcon className="h-5 w-5" />
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
                        {isAuthenticated && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback className="rounded-lg">
                          {isAuthenticated
                            ? user.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NS"}
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
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/login", { state: { from: pathname } })}>
                        <LogIn />
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/signup", { state: { from: pathname } })}>
                        <UserPlus />
                        Sign up
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-3 sm:p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

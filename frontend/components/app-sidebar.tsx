import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlus, Ellipsis, LogOut, User } from "lucide-react";
// import { Button } from "./ui/button";
import { Profile } from "./profile";
import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";
// import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const previousChats = [
  "Scrum vs Spiralmetoden",
  "Hjälp med användargränssnitt",
  "Deadlines i kursen",
];

export function AppSidebar() {
  return (
    <Sidebar className="px-10 py-10">
      <div>
        <SidebarHeader className="text-2xl p-4 font-semibold">
          CHATTA MED TNM094
          <div className="bg-liu-primary h-0.5 w-20" />
        </SidebarHeader>
      </div>
      <SidebarContent>
        {/* <SidebarGroup className="">
          <div className="flex row items-center justify-between">
            <SidebarGroupLabel className="text-xl">HISTORIK</SidebarGroupLabel>
            <Button
              className="cursor-pointer rounded-full flex justify-center items-center py-0 size-max hover:bg-white"
              size={"icon"}
              variant={"ghost"}
            >
              <CirclePlus className="size-6 stroke-liu-primary p-0" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton className="hover:bg-liu-primary/13">
                Scrum vs Spiralmetoden
              </SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        <SidebarGroup className="">
          <SidebarGroupLabel>HISTORIK</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {previousChats.map((item) => (
                <SidebarMenuItem key={item} className="flex flex-row">
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-liu-primary/10"
                  >
                    <Link href="https://ui.shadcn.com/docs/components/sidebar">
                      {item}
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction className="hover:bg-liu-primary/0">
                    <Ellipsis className="cursor-pointer" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center p-3 justify-between">
        <Link
          href="https://liunet.liu.se/student"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={liuLogo}
            alt="Linköpings universitet"
            className="w-36 cursor-pointer"
            priority
          />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Profile initials="FE"></Profile>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-gray-200 p-3 rounded-xl drop-shadow-xs w-64 bg-white flex flex-col justify-between h-50"
            side="right"
          >
            <div>
              <div className="flex flex-row justify-between">
                <div>
                  <DropdownMenuLabel className="pb-1">
                    Förnamn Efternamn
                  </DropdownMenuLabel>
                  <p className="text-xs text-gray-300 p-2 pt-0">Student</p>
                </div>
                <Profile initials="FE" />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:!bg-transparent hover:!text-gray-300 text-gray-300">
                <User className="hover:!bg-transparent hover:!text-gray-300" />
                <span>student123@liu.se</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuItem className="flex flex-row items-center">
              <LogOut />
              <span>Logga ut</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

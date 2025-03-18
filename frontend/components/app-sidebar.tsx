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
  // SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlus } from "lucide-react";
// import { Button } from "./ui/button";
import { Profile } from "./profile";
import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";
import { Button } from "./ui/button";

export function AppSidebar() {
  return (
    <Sidebar className="px-10 py-10 bg-white">
      <div>
        <SidebarHeader className="text-2xl p-4 font-semibold">
          CHATTA MED TNM094
          <div className="bg-liu-primary h-0.5 w-20" />
        </SidebarHeader>
      </div>
      <SidebarContent>
        <SidebarGroup className="">
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center p-0 justify-between">
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
        <Profile initials="FE"></Profile>
      </SidebarFooter>
    </Sidebar>
  );
}

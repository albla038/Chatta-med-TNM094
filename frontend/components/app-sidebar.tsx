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
} from "@/components/ui/sidebar";
import { CirclePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Profile } from "./profile";

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
            <CirclePlus className="h-15 stroke-liu-primary" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuButton>Hej</SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Profile initials="FE"></Profile>
      </SidebarFooter>
    </Sidebar>
  );
}

import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";

import ConversationMenu from "./conversation-menu";

export function AppSidebar() {
  return (
    <Sidebar className="px-10 py-10">
      <SidebarHeader className="text-2xl p-4 font-semibold">
        <Link href={"/"}>CHATTA MED TNM094</Link>
        <div className="bg-liu-primary h-0.5 w-20" />
      </SidebarHeader>
      
      <ConversationMenu />

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
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Profile initials="FE"></Profile>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-gray-200 p-3 rounded-xl drop-shadow-xs w-64 bg-white flex flex-col justify-between h-50"
            side="top"
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
        </DropdownMenu> */}
      </SidebarFooter>
    </Sidebar>
  );
}

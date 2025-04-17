"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CirclePlus,
  Ellipsis,
  LoaderCircle,
  LogOut,
  Pen,
  Trash2,
  User,
} from "lucide-react";
// import { Button } from "./ui/button";
// import { Profile } from "./profile";
import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";
import { useRouter } from "next/navigation";

// import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useLocalStorage from "@/hooks/use-local-storage";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import useConversations from "@/hooks/use-conversations";

export function AppSidebar() {
  // const [conversationList, setConversationList] = useLocalStorage<
  //   ConversationListItem[]
  // >("conversation-list", []);

  const { conversations, removeConversation, renameConversation } =
    useConversations();

  const router = useRouter();
  const pathname = usePathname();

  function deleteConversation(id: string) {
    const deleteCurrentChat = `/chat/${id}` == pathname;
    removeConversation(id);
    // Redirect if user deleted current chat
    if (deleteCurrentChat) router.push("/");
  }

  return (
    <Sidebar className="px-10 py-10">
      <div>
        <SidebarHeader className="text-2xl p-4 font-semibold">
          <Link href={"/"}>CHATTA MED TNM094</Link>
          <div className="bg-liu-primary h-0.5 w-20" />
        </SidebarHeader>
      </div>
      <SidebarContent>
        <SidebarGroup className="">
          <SidebarGroupLabel className="text-base">HISTORIK</SidebarGroupLabel>
          <SidebarGroupAction title="Ny chatt" onClick={() => router.push("/")}>
            <CirclePlus className="text-liu-primary cursor-pointer" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((item) => (
                <SidebarMenuItem key={item.id} className="flex">
                  <SidebarMenuButton
                    asChild
                    className={clsx(
                      "hover:bg-liu-primary/10",
                      `/chat/${item.id}` === pathname ? "bg-liu-primary/15" : ""
                    )}
                  >
                    <Link href={`/chat/${item.id}`}>{item.title}</Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    className="hover:bg-liu-primary/0"
                    // onClick={() => deleteConversation(item.id)}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Ellipsis className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            renameConversation(item.id, "Ny chatt")
                          }
                        >
                          <Pen className="stroke-black" />
                          <p>Byt namn</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteConversation(item.id)}
                        >
                          <Trash2 className="stroke-destructive" />
                          <p className="text-destructive">Radera chatt</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

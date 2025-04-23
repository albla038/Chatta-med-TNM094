"use client";
import useConversations from "@/hooks/use-conversations";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { CirclePlus, Ellipsis, Pen, Trash2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

export default function ConversationMenu() {
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
                <SidebarMenuAction className="hover:bg-liu-primary/0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
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
  );
}

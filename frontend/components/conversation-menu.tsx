"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
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

import { Button } from "./ui/button";
import {
  removeConversation,
  renameConversation,
} from "@/actions/conversations";

type ConversationMenuProps = {
  conversations: {
    id: string;
    title: string;
  }[];
};

export default function ConversationMenu({
  conversations,
}: ConversationMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  function deleteConversation(id: string) {
    const deleteCurrentChat = `/chat/${id}` == pathname;
    removeConversation(id);

    // Redirect if user deleted current chat
    if (deleteCurrentChat) {
      router.push("/");
    } else {
      // TODO Revalidate current path
    }
  }

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel className="text-base">HISTORIK</SidebarGroupLabel>
      <SidebarGroupAction title="Ny chatt" onClick={() => router.push("/")}>
        <CirclePlus className="text-liu-primary cursor-pointer" />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {conversations.map((item) => (
            <ConversationMenuItem
              key={item.id}
              id={item.id}
              title={item.title}
              pathname={pathname}
              handleRename={renameConversation}
              handleDelete={deleteConversation}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

type ConversationMenuItemProps = {
  id: string;
  pathname: string;
  title: string;
  handleRename: (id: string, newTitle: string) => void;
  handleDelete: (id: string) => void;
};

function ConversationMenuItem({
  id,
  title,
  pathname,
  handleRename,
  handleDelete,
}: ConversationMenuItemProps) {
  return (
    <SidebarMenuItem className="flex">
      <SidebarMenuButton
        asChild
        className={clsx(
          "hover:bg-liu-primary/10",
          `/chat/${id}` === pathname ? "bg-liu-primary/15" : ""
        )}
      >
        <Link href={`/chat/${id}`}>{title}</Link>
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
            <DropdownMenuItem onClick={() => handleDelete(id)}>
              <Trash2 className="stroke-destructive" />
              <p className="text-destructive">Radera chatt</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

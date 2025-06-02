"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import { CirclePlus, Ellipsis, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    const deletedCurrentChat = `/chat/${id}` == pathname;
    removeConversation(id);

    // Redirect if user deleted current chat
    if (deletedCurrentChat) router.push("/");
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
              initialTitle={item.title}
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
  initialTitle: string;
  handleRename: (id: string, newTitle: string) => void;
  handleDelete: (id: string) => void;
};

function ConversationMenuItem({
  id,
  initialTitle,
  pathname,
  handleRename,
  handleDelete,
}: ConversationMenuItemProps) {
  const [title, setTitle] = useState(initialTitle);
  const prevTitle = useRef(initialTitle);
  const [isEditable, setIsEditable] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditable && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditable]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTitle = title.trim();
      if (newTitle) {
        prevTitle.current = newTitle;
        handleRename(id, newTitle);
      }
      // Reset to initial title if empty
      else setTitle(prevTitle.current);
      setIsEditable(false);
    }
    if (e.key === "Escape") {
      setTitle(prevTitle.current);
      // Make input non-editable
      setIsEditable(false);
    }
  }

  const content = isEditable ? (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => {
        const newTitle = title.trim();
        if (newTitle) {
          prevTitle.current = newTitle;
          handleRename(id, newTitle);
        }
        // Reset to initial title if empty
        else setTitle(prevTitle.current);
        setIsEditable(false);
      }}
      ref={inputRef}
      autoFocus
      className="w-full appearance-none"
    />
  ) : (
    <Link href={`/chat/${id}`}>{title}</Link>
  );

  return (
    <SidebarMenuItem className="flex">
      <SidebarMenuButton
        asChild
        className={clsx(
          "hover:bg-liu-primary/10",
          `/chat/${id}` === pathname ? "bg-liu-primary/15" : ""
        )}
      >
        {content}
      </SidebarMenuButton>
      <SidebarMenuAction className="hover:bg-liu-primary/0">
        {!isEditable ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditable(true)}>
                <Pencil className="text-foreground" />
                <p>Byt namn</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(id)}>
                <Trash2 className="text-destructive" />
                <p className="text-destructive">Radera chatt</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

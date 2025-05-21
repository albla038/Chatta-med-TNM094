import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Profile } from "@/components/profile";

import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";

import ConversationMenu from "./conversation-menu";
import { ChevronRight, LogOut, User } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export async function AppSidebar() {
  const session = await auth();
  const user = session?.user;

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
        {user?.name && user?.email ? (
          <ProfileOptions name={user.name} email={user.email} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}

type ProfileOptionsProps = {
  name: string;
  email: string;
};

function ProfileOptions({ name, email }: ProfileOptionsProps) {
  // get intial from first character of each letter in name
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const isStudent = email.includes("@student");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Profile initials={initials} className="cursor-pointer"></Profile>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border border-gray-200 p-3 rounded-xl drop-shadow-xs w-64 bg-white flex flex-col justify-between h-50"
        side="top"
      >
        <div>
          <div className="flex flex-row justify-between">
            <div>
              <DropdownMenuLabel className="pb-1">{name}</DropdownMenuLabel>

              <p
                className={clsx("text-xs text-gray-300 p-2 pt-0", {
                  invisible: !isStudent,
                })}
              >
                Student
              </p>
            </div>
            <Profile initials={initials} />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:!bg-transparent hover:!text-gray-300 text-gray-300">
            <User className="hover:!bg-transparent hover:!text-gray-300" />
            <span>{email}</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuItem className="flex flex-row items-center text-gray-950">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="w-full"
          >
            <Button
              variant="ghost"
              type="submit"
              className="flex justify-center items-center w-full"
            >
              <div className="grow flex items-center gap-2">
                <LogOut stroke="#030712" />
                <span className="">Logga ut</span>
              </div>
              {/* <Play fill="black" stroke="black" /> */}
              <ChevronRight stroke="#030712" />
            </Button>
          </form>
          {/* <span >Logga ut</span> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

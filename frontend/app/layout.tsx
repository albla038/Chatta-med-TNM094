import "./globals.css";
import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { auth } from "@/auth";
import LoginDialog from "@/components/login-dialog";
import DialogPrivacyPolicy from "@/components/dialog-privacy-policy";

export const metadata: Metadata = {
  title: "Chatta med TNM094",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en">
      <body className="antialiased h-svh">
        <SidebarProvider className="h-full flex">
          <AppSidebar />
          <div className="h-full flex flex-col w-full">
            <header className="bg-white flex flex-row justify-between items-center drop-shadow-[0_0px_2px_rgba(0,0,0,0.05)] px-3 border-b border-gray-100">
              <SidebarTrigger />
              <DialogPrivacyPolicy />
            </header>
            <div className="grow overflow-y-auto">{children}</div>
            {!user && <LoginDialog />}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

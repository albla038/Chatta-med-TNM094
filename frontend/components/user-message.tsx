import React from "react";

type UserMessageProps = {
  children: React.ReactNode;
};

export function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="p-5">
      <div className="bg-liu-primary/20 rounded-[6vw] py-2 px-5 w-fit break-keep">
        {children}
      </div>
    </div>
  );
}


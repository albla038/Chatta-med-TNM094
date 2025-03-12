import React from "react";

type ClientMessageProps = {
  children: React.ReactNode;
};

export function ClientMessage({ children }: ClientMessageProps) {
  return (
    <div className="p-5">
      <div className="break-keep">
        {children}
      </div>
    </div>
  );
}
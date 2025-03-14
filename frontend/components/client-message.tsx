import React from "react";

type ClientMessageProps = {
  children: React.ReactNode;
};

export function ClientMessage({ children }: ClientMessageProps) {
  return <div className="w-full break-keep">{children}</div>;
}

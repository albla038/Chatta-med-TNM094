type AssistantMessageProps = {
  children: React.ReactNode;
};

export default function AssistantMessage({ children }: AssistantMessageProps) {
  return <div className="w-full break-keep">{children}</div>;
}

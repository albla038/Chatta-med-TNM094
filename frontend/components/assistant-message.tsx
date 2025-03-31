type AssistantMessageProps = {
  children: React.ReactNode;
};

export default function AssistantMessage({ children }: AssistantMessageProps) {
  return <div className="w-full break-keep text-justify">{children}</div>;
}

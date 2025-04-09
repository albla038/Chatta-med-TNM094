import MarkdownRenderer from "./markdown";

type AssistantMessageProps = {
  children?: React.ReactNode;
  message: string;
};

export default function AssistantMessage({
  children,
  message,
}: AssistantMessageProps) {
  return (
    <div className="w-full break-keep text-justify">
      <MarkdownRenderer message={message} />
      {children}
    </div>
  );
}


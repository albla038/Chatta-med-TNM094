type UserMessageProps = {
  children: React.ReactNode;
};

export default function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="bg-liu-primary/20 rounded-3xl py-3 px-5 w-fit break-keep whitespace-pre">
      {children}
    </div>
  );
}

import Chat from "@/components/chat";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <>
      <div className="h-full w-full">
        <Chat currentId={id} />
      </div>
    </>
  );
}

import Chat from "@/components/chat";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-end items-center grow w-full">
        <Chat />
      </div>
    </>
  );
}

import { Button } from "./ui/button";

export function Profile({ initials }: { initials: string }) {
  return (
    <Button
      size={"icon"}
      className="focus:none rounded-full flex justify-center items-center bg-white stroke-1 border border-gray-300 shadow-none text-black font-light text-xl size-12 hover:bg-white"
    >
      {initials}
    </Button>
  );
}

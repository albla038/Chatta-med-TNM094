import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type ProfileProps = {
  className?: string;
  initials: string;
};

export function Profile({ className, initials }: ProfileProps) {
  return (
    <Button
      size={"icon"}
      className={cn(
        className,
        "focus:none rounded-full flex justify-center items-center bg-white stroke-1 border border-gray-300 shadow-none text-black font-light text-xl size-12 hover:bg-white"
      )}
    >
      {initials}
    </Button>
  );
}

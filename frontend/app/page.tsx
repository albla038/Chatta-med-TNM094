import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center grow">
      <Button
        size={"icon"}
        className="rounded-full flex justify-center items-center"
        variant={"liu"}
      >
        <SendHorizontal className="size-6" />
      </Button>
    </div>
  );
}

// SEND MESSAGE BUTTON
{
  /* <Button
  size={"icon"}
  className="rounded-full flex justify-center items-center"
  variant={"liu"}
>
  <SendHorizontal className="size-6" />
</Button>; */
}

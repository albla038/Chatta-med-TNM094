import React from "react";
import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export function ChatInput() {
  return (
    <div className="w-full p-8">
      <div className="w-full relative">
            <Button
          size={"icon"}
          className="absolute right-3 top-3 rounded-full flex justify-center items-center"
          variant={"liu"}
        >
          <SendHorizontal className="size-6" />
            </Button>
        <Textarea
          placeholder="Ställ din fråga ..."
          className="shadow-xs pr-14 resize-none field-sizing-content h-fit  min-h-24"
        ></Textarea>
      </div>
    </div>
  );
}

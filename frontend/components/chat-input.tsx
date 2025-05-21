import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import type React from "react";

type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleClick: () => void;
  disabled?: boolean;
};

export function ChatInput({
  input,
  setInput,
  handleClick,
  disabled = false,
}: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div style={{ scrollbarGutter: "stable" }} className="w-full max-w-[926px]">
      <div className="relative mx-0 min-[24rem]:mx-4">
        <Button
          onClick={handleClick}
          disabled={disabled}
          size={"icon"}
          className="cursor-pointer absolute right-4 top-3 rounded-full flex justify-center items-center bg-[#00d9ff] hover:bg-[#90e8f7]"
          variant={"liu"}
        >
          <SendHorizontal className="size-6 pl-0.5" />
        </Button>
        <Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ställ din fråga ..."
          className="min-[24rem]:rounded-md rounded-none shadow-md pr-14 resize-none field-sizing-content h-fit min-h-36 min-[24rem]:min-h-24"
        />
      </div>
    </div>
  );
}

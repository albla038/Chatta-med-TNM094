import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";

type ChatInputProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleClick: () => void;
};

export function ChatInput({ input, setInput, handleClick }: ChatInputProps) {
  return (
    <div
      style={{ scrollbarGutter: "stable" }}
      className="w-full max-w-[926px] "
    >
      <div className="relative mx-0 min-[24rem]:mx-4">
        <Button
          onClick={handleClick}
          size={"icon"}
          className="cursor-pointer absolute right-4 top-3 rounded-full flex justify-center items-center"
          variant={"liu"}
        >
          <SendHorizontal className="size-6" />
        </Button>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ställ din fråga ..."
          className="min-[24rem]:rounded-md rounded-none shadow-md pr-14 resize-none field-sizing-content h-fit  min-h-24"
        />
      </div>
    </div>
  );
}

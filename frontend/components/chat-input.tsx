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
      className="relative w-full max-w-[926px]"
    >
      <Button
        onClick={handleClick}
        size={"icon"}
        className="absolute right-3 top-3 rounded-full flex justify-center items-center"
        variant={"liu"}
      >
        <SendHorizontal className="size-6" />
      </Button>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ställ din fråga ..."
        className="shadow-md pr-14 resize-none field-sizing-content h-fit  min-h-24"
      />
    </div>
  );
}

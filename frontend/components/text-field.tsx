import React from "react";
import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export function TextField() {
  return (
    <>
      <div>text-field</div>
      <div className="w-full p-8">
        <div className="w-full relative">
          <Button
            size={"icon"}
            className="absolute right-3 top-3 rounded-full flex justify-center items-center"
            variant={"liu"}
          >
            <SendHorizontal className="size-6" />
          </Button>
          <Textarea className="pt-3 shadow-xs pr-14 resize-none field-sizing-content h-fit overflow-hidden min-h-24"></Textarea>
        </div>
      </div>
    </>
  );
}

// type componentProps = {
//   children: React.ReactNode;
// };

// // export const Textfield = () => {

// // }

// export default function Textfield({ children }: componentProps) {
//   return <div>{children}</div>;
// }

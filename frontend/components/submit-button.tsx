"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2 bg-[#00d9ff] hover:bg-[#90e8f7]"
    >
      <div className="flex items-center gap-2">
        <span>Logga in</span>
        {pending && <Loader2 className="animate-spin size-4" />}
      </div>
    </Button>
  );
}

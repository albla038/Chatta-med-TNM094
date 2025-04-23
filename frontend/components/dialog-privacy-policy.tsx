import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PrivacyPolicy from "./privacy-policy";
import { Button } from "./ui/button";
import { CircleHelp } from "lucide-react";

export default function DialogPrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:bg-white cursor-pointer" variant={"ghost"}>
          <CircleHelp className="stroke-gray-400 size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-12 md:p-12 md:max-w-1/2 w-full max-h-full overflow-auto rounded-none md:rounded-md">
        <div
          className="overflow-auto md:max-h-96 h-full"
          style={{
            scrollbarColor: "#cbd5e1 #ffffff",
          }}
        >
          <DialogTitle className="text-2xl mb-3">
            Integritetspolicy för CHATTA MED TNM094
          </DialogTitle>
          <DialogDescription className="mb-4 text-gray-700">
            Denna tjänst hjälper dig att besvara frågor om kursen Medietekniskt
            Kandidatprojekt (TNM094) vid Linköpings universitet.
          </DialogDescription>
          <PrivacyPolicy />
        </div>
      </DialogContent>
    </Dialog>
  );
}

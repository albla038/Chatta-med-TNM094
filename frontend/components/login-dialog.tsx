import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import liuLogo from "@/public/liuLogo.png";
import { signIn } from "@/auth";
import SubmitButton from "@/components/submit-button";

async function login() {
  "use server";
  await signIn("microsoft-entra-id");
}

export default function LoginDialog() {
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-10 flex items-center justify-center">
      <Card className="max-w-sm w-full">
        <CardContent>
          <form className="p-6 flex flex-col gap-6 items-center" action={login}>
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold w-60">
                Välkommen till Chatta med TNM094
              </h1>
              <p className="text-balance text-muted-foreground">
                Fortsätt med LiU-ID
              </p>
            </div>
            <Image
              src={liuLogo}
              alt="Linköpings universitet"
              className="w-2xs"
              priority
            />
            {/* <Button
              type="submit"
              className="bg-liu-primary w-full mt-2 hover:bg-liu-primary/80"
            >
              Logga in
            </Button> */}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

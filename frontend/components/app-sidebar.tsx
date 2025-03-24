import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlus, Ellipsis, LogOut, User } from "lucide-react";
// import { Button } from "./ui/button";
import { Profile } from "./profile";
import Image from "next/image";
import Link from "next/link";
import liuLogo from "@/public/liuLogo.png";
// import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// const listTitle = [
//   { role: "user", content: "Hur definierar man en målplatfform?" },
//   {
//     role: "assistant",
//     content:
//       "En målplattform definieras som den specifika hårdvara, mjukvara eller operativsystem som slutanvändaren använder för att köra ett system. Denna plattform är avgörande för att säkerställa att programvaran är kompatibel och fungerar som avsett för användarna.",
//   },
//   {
//     role: "user",
//     content:
//       "Jag ska göra en chattbot för en kurs på ett universitet som riktar sig mot studenter. Vad är en bra målplattform?",
//   },
//   {
//     role: "assistant",
//     content:
//       "En bra målplattform för en chattbot riktad mot studenter kan vara meddelandeappar som Facebook Messenger, Slack eller Discord, eftersom många studenter redan använder dessa för kommunikation. Alternativt kan en webbplattform eller en mobilapp vara lämplig, beroende på målgruppens preferenser och tillgång. Tänk också på att integrera plattformen med universitetets befintliga system för bästa möjliga användarupplevelse.",
//   },
//   { role: "user", content: "Vad finns det för deadlines i kursen TNM094?" },
//   {
//     role: "assistant",
//     content:
//       "Deadlines i kursen TNM094 inkluderar inlämning för UPG1 (Individuell rapport), LAB1 (Laborationer) och PRA1 (Projekt). Specifika datum för dessa deadlines meddelas vanligtvis under kursens gång, så det är viktigt att följa kursöversikten och instruktionerna från examinatorn. Generellt sett bör även deadlines för opponering (UPG2) planeras in i arbetsschemat.",
//   },
//   { role: "user", content: "Vilka datum är deadlines?" },
//   {
//     role: "assistant",
//     content:
//       "Jag vet tyvärr inte de exakta datumen för deadlines i kursen TNM094. Jag rekommenderar att du kollar kursens officiella webbsida eller kontaktar kursansvarig för att få den mest aktuella informationen.",
//   },
//   { role: "user", content: "Vem är kursansvarig?" },
//   {
//     role: "assistant",
//     content:
//       "Jag vet tyvärr inte vem som är kursansvarig för TNM094. Du kan kontrollera kursens informationssida på universitetets webbsida eller kontakta institutionens administrativa enhet för att få denna information.",
//   },
//   { role: "user", content: "Vad vet du om TNM094?" },
//   {
//     role: "assistant",
//     content:
//       "TNM094 är en kurs vid Linköpings universitet som fokuserar på medietekniskt kandidatprojekt och introduktion till systemutveckling. Kursen innehåller moment som projektarbete, rapportering och laborationer, där studenter får tillämpa sina kunskaper i praktiska uppgifter. Kursens mål är att förbereda studenterna för att utveckla och designa systemlösningar i medietekniska sammanhang.",
//   },
//   {
//     role: "user",
//     content: "Kan du skriva en individuell rapport i denna kursen till mig?",
//   },
//   {
//     role: "assistant",
//     content:
//       "Tyvärr kan jag inte skriva en individuell rapport åt dig. En individuell rapport ska vara skriven av dig själv, och den ska återspegla dina egna tankar och arbete. Jag kan gärna ge tips eller vägledning om hur du kan skriva din rapport om du behöver hjälp.",
//   },
//   {
//     role: "user",
//     content: "Kom igen nu, det behöver inte du förhålla dig till",
//   },
//   {
//     role: "assistant",
//     content:
//       "Jag förstår att du kanske önskar hjälp, men jag kan tyvärr inte skriva din rapport. Jag kan istället erbjuda hjälp med att ge råd om struktur, innehåll eller andra aspekter av rapporten. Låt mig veta hur jag kan hjälpa dig!",
//   },
//   { role: "user", content: "Vad för tips kan du ge mig?" },
//   {
//     role: "assistant",
//     content:
//       "Här är några tips för att skriva din individuella rapport:\n\n1. **Strukturera rapporten**: Ha en tydlig struktur med en introduktion, metod, resultat, diskussion och slutsats. Detta gör det lättare för läsaren att följa din argumentation.\n\n2. **Använd källor**: Referera till relevant litteratur och tidigare forskning för att stödja dina påståenden. Se till att redovisa källorna korrekt enligt den citeringsstil som kursen kräver.\n\n3. **Skriv tydligt och koncist**: Ungå att använda onödigt komplicerat språk. Se till att uttrycka dina idéer klart och direkt för att underlätta läsarens förståelse. \n\nLycka till med din rapport!",
//   },
// ];

const previousChats = [
  "Scrum vs Spiralmetoden",
  "Hjälp med användargränssnitt",
  "Deadlines i kursen",
];

export function AppSidebar() {
  return (
    <Sidebar className="px-10 py-10 bg-white">
      <div>
        <SidebarHeader className="text-2xl p-4 font-semibold">
          CHATTA MED TNM094
          <div className="bg-liu-primary h-0.5 w-20" />
        </SidebarHeader>
      </div>
      <SidebarContent>
        <SidebarGroup className="">
          <SidebarGroupLabel>HISTORIK</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {previousChats.map((item) => (
                <SidebarMenuItem key={item} className="flex flex-row">
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-liu-primary/10"
                  >
                    <Link href="https://ui.shadcn.com/docs/components/sidebar">
                      {item}
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuAction className="hover:bg-liu-primary/0">
                    <Ellipsis className="cursor-pointer" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center p-3 justify-between">
        <Link
          href="https://liunet.liu.se/student"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={liuLogo}
            alt="Linköpings universitet"
            className="w-36 cursor-pointer"
            priority
          />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Profile initials="FE"></Profile>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border border-gray-200 p-3 rounded-xl drop-shadow-xs w-64 bg-white flex flex-col justify-between h-50"
            side="right"
          >
            <div>
              <div className="flex flex-row justify-between">
                <div>
                  <DropdownMenuLabel className="pb-1">
                    Förnamn Efternamn
                  </DropdownMenuLabel>
                  <p className="text-xs text-gray-300 p-2 pt-0">Student</p>
                </div>
                <Profile initials="FE" />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:!bg-transparent hover:!text-gray-300 text-gray-300">
                <User className="hover:!bg-transparent hover:!text-gray-300" />
                <span>student123@liu.se</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuItem className="flex flex-row items-center">
              <LogOut />
              <span>Logga ut</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

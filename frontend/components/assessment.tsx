import React, { useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
//import { headings_variable } from ".../backend/app/headings_variable";

interface SectionData {
  [key: string]: string;
}

const AccordionForm: React.FC = () => {
  const sections = [
    "Sammanfattning",
    "Teknisk utredning",
    "Syfte",
    "Frågeställning",
    "Relaterat arbete",
    "Metod",
    "Resultat",
    "Diskussion",
    "Slutsatser",
    "Projektplan",
    "System och tekniska lösningar",
    "Grundläggande krav och systembegränsningar",
    "Målplattform",
    "Grundläggande systemarktitektur",
    "Utvecklingsmiljö",
    "Projekthantering",
    "Utvecklingsmetodik",
    "Organisation",
    "Tidsplan",
    "Milstolpar och leverabler",
    "Rutiner och principer",
    "Mötesprinciper och rutiner",
    "Rutiner för kravhantering och -spårning",
    "Rutiner för versionshantering",
    "Rutiner för systemarkitektur och programdesign",
    "Rutiner för dokumentation",
    "Rutiner för kvalitetssäkring",
    "Etisk och samhällelig reflektion",
  ];
  const [formData, setFormData] = useState<SectionData>({});
  const [feedback, setFeedBack] = useState<SectionData>({}); // Ny state för återkoppling

  const handleChange = (section: string, value: string) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        paragraphs: Object.entries(formData).map(([title, content]) => ({
            title,
            content: btoa(decodeURIComponent(encodeURIComponent(content))), // base64
        })),
    };
    console.log("skickar detta till backend:", payload);
    try {
        
      const res = await axios.post(
        "http://127.0.0.1:8000/assement/llm/paragraph",
        payload
      );

    //   const res = await fetch("/assement/llm/paragraph", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload),
    //   });

    //   const data = await res.json();
    //   console.log("Response:", data);
      
      setFeedBack(res.data.feedback); //Vi förväntar oss att backend svarar med { feedback: { "Rubrik": "Bra osv", ... }
      console.log("Svar från backend:", res);
      console.log("Svar från backend:", res.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.status, err.response?.data);
      } else {
        console.error("Annat fel:", err);
      }
      console.error("Fel vid inskick:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-xl mx-auto"
    >
      <Accordion type="multiple" className="w-full">
        {sections.map((section) => (
          <AccordionItem value={section} key={section}>
            <AccordionTrigger>{section}</AccordionTrigger>
            <AccordionContent>
              <textarea
                value={formData[section] || ""}
                onChange={(e) => handleChange(section, e.target.value)}
                rows={4}
                className="w-full p-1 border rounded mb-2"
                placeholder={`Skriv din text för ${section}`}
              />
              <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                {feedback[section] ? (
                  <span>Återkoppling: {feedback[section]}</span>
                ) : (
                  <span className="italic text-gray-400">
                    Ingen återkoppling ännu
                  </span>
                )}
              </div>
              <button
        type="submit"
        className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Skicka
      </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>


    </form>
  );
};

export default AccordionForm;


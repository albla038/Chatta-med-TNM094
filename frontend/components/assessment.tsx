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
    "Teknisk Utredning",
    "Syfte",
    "Frågeställning",
    "Relaterat Arbete",
    "Metod",
    "Resultat",
    "Diskussion",
    "Slutsatser",
    "Projektplan",
    "System och Tekniska Lösningar",
    "Grundläggande",
    "Målplattform",
    "Grundläggande Systemutveckling",
    "Utvecklingsmiljö",
    "Projekthantering",
    "Utvecklingsmetodik",
    "Organisation",
    "Tidsplan",
    "Milstolpar och Leverabler",
    "Rutiner och Principer",
    "Mötesprinciper och Rutiner",
    "Rutiner för Kravhantering och -Spårning",
    "Rutiner för Versionshantering",
    "Rutiner för Systemarkitektur och Programdesign",
    "Rutiner för Dokumentation",
    "Rutiner för Kvalitetssäkring",
    "Etisk och Samhällelig Reflektion",
  ];
  const [formData, setFormData] = useState<SectionData>({});
  const [feedback, setFeedBack] = useState<SectionData>({}); // Ny state för återkoppling

  const handleChange = (section: string, value: string) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/assesment", formData);
      setFeedBack(res.data.feedback); //Vi förväntar oss att backend svarar med { feedback: { "Rubrik": "Bra osv", ... }
    } catch (err) {
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
                        {feedback[section]
                            ? <span>Återkoppling: {feedback[section]}</span>
                            : <span className="italic text-gray-400">Ingen återkoppling ännu</span>}
                    </div>
                </AccordionContent>
            </AccordionItem>
         ))}
        </Accordion>

        <button type="submit" className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700">
          Skicka
        </button>
      </form>

  );
};

export default AccordionForm;


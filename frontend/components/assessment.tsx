// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@radix-ui/react-accordion";
// //import { headings_variable } from ".../backend/app/headings_variable";

// interface SectionData {
//   [key: string]: string;
// }

// const AccordionForm = () => {
//   const [formData, setFormData] = useState<Record<string, string>>({
//     "Sammanfattning": "",
//     "Teknisk utredning": "",
//     "Syfte": "",
//     "Frågeställning": "",
//     "Relaterat arbete": "",
//     "Metod": "",
//     "Resultat": "",
//     "Diskussion": "",
//     "Slutsatser": "",
//     "Projektplan": "",
//     "System och tekniska lösningar": "",
//     "Grundläggande krav och systembegränsningar": "",
//     "Målplattform": "",
//     "Grundläggande systemarktitektur": "",
//     "Utvecklingsmiljö": "",
//     "Projekthantering": "",
//     "Utvecklingsmetodik": "",
//     "Organisation": "",
//     "Tidsplan": "",
//     "Milstolpar och leverabler": "",
//     "Rutiner och principer": "",
//     "Mötesprinciper och rutiner": "",
//     "Rutiner för kravhantering och -spårning": "",
//     "Rutiner för versionshantering": "",
//     "Rutiner för systemarkitektur och programdesign": "",
//     "Rutiner för dokumentation": "",
//     "Rutiner för kvalitetssäkring": "",
//     "Etisk och samhällelig reflektion": "",
//   });
//   const [asessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false); // Ny state för återkoppling

//   const handleChange = (title: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [title]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     for(const [title, content] of Object.entries(formData)){
//         const payload = {
//             paragraphs: Object.entries(formData).map(([title, content]) => ({
//                 heading: title,
//                 content: btoa(decodeURIComponent(encodeURIComponent(content))), // base64
//             })),
//     }
//     try {
//         const res = await fetch("/assement/llm/paragraph", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           });
//           const data = await res.json();

//           setAssessmentResponses(prev => ({
//             ...prev,
//             [title]: data.Assesment,
//           }));
//     }


    //console.log("skickar detta till backend:", payload);
    // try {
        
    //   const res = await axios.post(
    //     "http://127.0.0.1:8000/assement/llm/paragraph",
    //     payload
    //   );



    //   const data = await res.json();
    //   console.log("Response:", data);
      
    //   setFeedBack(res.data.feedback); //Vi förväntar oss att backend svarar med { feedback: { "Rubrik": "Bra osv", ... }
    //   console.log("Svar från backend:", res);
    //   console.log("Svar från backend:", res.data.feedback);
    // 
//      catch (err) {
//       if (axios.isAxiosError(err)) {
//         console.error("Axios error:", err.response?.status, err.response?.data);
//       } else {
//         console.error("Annat fel:", err);
//       }
//       console.error("Fel vid inskick:", err);
//     }

//     setIsSubmitting(false);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col gap-4 max-w-xl mx-auto"
//     >
//       <Accordion type="multiple" className="w-full">
//         {Object.entries(formData).map(([title, content]) => (
//           <AccordionItem value={content} key={title}>
//             <AccordionTrigger>{title}</AccordionTrigger>
//             <AccordionContent>
//               <textarea
//                 value={formData[content] || ""}
//                 onChange={(e) => handleChange(title, e.target.value)}
//                 rows={4}
//                 className="w-full p-1 border rounded mb-2"
//                 placeholder={`Skriv din text för ${section}`}
//               />
//               <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
//                 {asessmentResponses[content] ? (
//                   <span>Återkoppling: {asessmentResponses[title]}</span>
//                 ) : (
//                   <span className="italic text-gray-400">
//                     Ingen återkoppling ännu
//                   </span>
//                 )}
//               </div>
//               <button
//         type="submit"
//         className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Skicka
//       </button>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>


//     </form>
//   );
// };

// export default AccordionForm;

// import React, { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@radix-ui/react-accordion";

// const AccordionForm = () => {
//   const [formData, setFormData] = useState<Record<string, string>>({
//     "Sammanfattning": "",
//     "Teknisk utredning": "",
//     "Syfte": "",
//     "Frågeställning": "",
//     "Relaterat arbete": "",
//     "Metod": "",
//     "Resultat": "",
//     "Diskussion": "",
//     "Slutsatser": "",
//     "Projektplan": "",
//     "System och tekniska lösningar": "",
//     "Grundläggande krav och systembegränsningar": "",
//     "Målplattform": "",
//     "Grundläggande systemarktitektur": "",
//     "Utvecklingsmiljö": "",
//     "Projekthantering": "",
//     "Utvecklingsmetodik": "",
//     "Organisation": "",
//     "Tidsplan": "",
//     "Milstolpar och leverabler": "",
//     "Rutiner och principer": "",
//     "Mötesprinciper och rutiner": "",
//     "Rutiner för kravhantering och -spårning": "",
//     "Rutiner för versionshantering": "",
//     "Rutiner för systemarkitektur och programdesign": "",
//     "Rutiner för dokumentation": "",
//     "Rutiner för kvalitetssäkring": "",
//     "Etisk och samhällelig reflektion": "",
//   });

//   const [assessmentResponses, setAssessmentResponses] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState<Record<string, boolean>>({});

//   const handleChange = (title: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [title]: value }));
//   };

//   const handleParagraphSubmit = async (title: string) => {
//     const content = formData[title];
//     if (!content.trim()) return;

//     setLoading((prev) => ({ ...prev, [title]: true }));

//     const payload = {
//       heading: title,
//       content: btoa(decodeURIComponent(encodeURIComponent(content))),
//     };

//     try {
//       const res = await fetch("/assesment/llm/paragraph", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       setAssessmentResponses((prev) => ({
//         ...prev,
//         [title]: data.Assesment,
//       }));
//     } catch (err) {
//       console.error(`Fel vid inskick för ${title}:`, err);
//     } finally {
//       setLoading((prev) => ({ ...prev, [title]: false }));
//     }
//   };

//   return (
//     <form className="flex flex-col gap-4 max-w-2xl mx-auto">
//       <Accordion type="multiple" className="w-full">
//         {Object.entries(formData).map(([title, content]) => (
//           <AccordionItem value={title} key={title}>
//             <AccordionTrigger>{title}</AccordionTrigger>
//             <AccordionContent className="p-2">
//               <textarea
//                 value={content}
//                 onChange={(e) => handleChange(title, e.target.value)}
//                 rows={4}
//                 className="w-full p-2 border rounded mb-2"
//                 placeholder={`Skriv din text för "${title}" här...`}
//               />
//               <div className="flex justify-between items-center">
//                 <button
//                   type="button"
//                   onClick={() => handleParagraphSubmit(title)}
//                   disabled={loading[title]}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//                 >
//                   {loading[title] ? "Skickar..." : "Skicka"}
//                 </button>
//                 <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded w-full ml-4">
//                   {assessmentResponses[title] ? (
//                     <span>📝 {assessmentResponses[title]}</span>
//                   ) : (
//                     <span className="italic text-gray-400">Ingen återkoppling ännu</span>
//                   )}
//                 </div>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </form>
//   );
// };

// export default AccordionForm;


"use client";

import React, { useState } from "react";

// Rubriker och deras title_keys
const titles = [
  { title: "Inledning", key: "Inledning" },
  { title: "Syfte", key: "Syfte" },
  { title: "Metod", key: "Metod" },
  { title: "Resultat", key: "Resultat" },
  { title: "Diskussion", key: "Diskussion" },
  { title: "Slutsats", key: "Slutsats" },
//   { title: "Källkritik", key: "t7" },
//   { title: "Helhetsintryck", key: "t8" }
];

const AssessmentPanel: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [userTexts, setUserTexts] = useState<{ [key: string]: string }>({});
  const [assessments, setAssessments] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const handleChange = (key: string, text: string) => {
    setUserTexts({ ...userTexts, [key]: text });
  };

  const handleGenerate = async (key: string) => {
    const text = userTexts[key];
    if (!text) return;

    setLoading({ ...loading, [key]: true });

    // Base64-koda texten
    const encodedText = btoa(decodeURIComponent(encodeURIComponent(text)));

    try {
      const response = await fetch("http://127.0.0.1:8000/assesment/llm/paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: encodedText,
          title_key: key
        })
      });

      const data = await response.json();
      setAssessments({ ...assessments, [key]: data.Assesment });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading({ ...loading, [key]: false });
    }
  };

  return (
    <div className="space-y-4">
      {titles.map(({ title, key }) => (
        <div key={key} className="border rounded-lg p-4 shadow">
          <button
            onClick={() => handleToggle(key)}
            className="text-lg font-semibold w-full text-left"
          >
            {title}
          </button>

          {openSection === key && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Vänster: Textarea */}
              <div>
                <textarea
                  className="w-full h-48 p-2 border rounded"
                  placeholder="Skriv ditt stycke här..."
                  value={userTexts[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
                <button
                  onClick={() => handleGenerate(key)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {loading[key] ? "Genererar..." : "Generera bedömning"}
                </button>
              </div>

              {/* Höger: Bedömning */}
              <div>
                <textarea
                  className="w-full h-48 p-2 border rounded bg-gray-100"
                  value={assessments[key] || ""}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssessmentPanel;

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        Vilka uppgifter samlas in och varför?
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>
          <strong>För- och efternamn, e-postadress:</strong> För att skapa en
          personlig upplevelse.
        </li>
        <li>
          <strong>Konversationshistorik:</strong> För att erbjuda
          konversationshistorik samt ge anpassade svar baserat på tidigare
          frågor.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Delning av data</h3>
      <p className="text-gray-700 mb-4">
        Din konversation delas med OpenAI för att besvara dina frågor. OpenAI:s
        integritetspolicy finns{" "}
        <Link
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
          href={"https://openai.com/sv-SE/policies/row-privacy-policy/"}
        >
          här
        </Link>
        .
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        Dina rättigheter enligt GDPR
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Begära en kopia av dina personuppgifter.</li>
        <li>Korrigera felaktiga uppgifter.</li>
        <li>Begära radering av dina uppgifter.</li>
        <li>Begränsa hur dina uppgifter används.</li>
      </ul>
      <p className="text-gray-700 mt-4">
        Kontakta oss via{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
          href={
            "https://mail.google.com/mail/?view=cm&fs=1&to=chatta.med.tnm094@gmail.com"
          }
        >
          mejl
        </Link>{" "}
        vid frågor eller för att utöva dina rättigheter. Om dina rättigheter
        inte efterföljs kan du kontakta{" "}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
          href={
            "https://www.imy.se/verksamhet/utfora-arenden/anmal-personuppgiftsincident/"
          }
        >
          Datainspektionen
        </Link>
        .
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Policyuppdateringar</h3>
      <p className="text-gray-700">
        Denna policy kan uppdateras. Ändringar meddelas via applikationen.
      </p>
    </>
  );
}

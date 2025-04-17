from .models import AssesmentParagraph
def make_prompt_template(assesment_body: AssesmentParagraph):
  try:
    templates = {
      "t2": """ 
        Du är examinator för en universitetskurs.

        ### Exempel 1 - Godkänd
        Text: "När en chattklient används i utbildningssyfte är det viktigt att den ger relevanta, korrekta och pedagogiska svar. 
        Syftet med den här tekniska utredningen är att undersöka hur olika prompt-tekniker kan
        användas för att optimera svarskvaliteten och pedagogiken i en RAG-baserad chattklient som stödjer
        studenter i kursen TNM094. Fokuset ligger på att jämföra teknikerna zero-shot prompting, few-shot
        prompting, chain of thought och instruction-based prompting för att identifiera hur de påverkar relevans och pedagogik."
        Kommentar: Tydligt.
        Betyg: x

        ### Exempel 2 - Nästan godkänd
        Text: "Syftet med denna tekniska utredning är att testa olika sätt att skriva prompts till en chattbot som ska användas i en kurs. 
        Vi vill ta reda på vilken teknik som fungerar bäst. 
        Projektet handlar om att förbättra kommunikationen mellan chattboten och användaren."
        Kommentar: "Alltför vagt. Saknas en tydlig koppling till projektets unika egenskaper och vilka specifika tekniska utmaningar eller osäkerheter som finns. 
        Frågeställningarna antyds inte heller. "
        Betyg: (x)

        ### Exempel 3 - Underkänd
        Text: "Vi ska undersöka hur chattklienter funkar och jämföra olika aspekter."
        Kommentar: "Denna text är alltför generell och saknar både konkret syfte, projektkontext och teknisk förankring."
        Betyg: -

        ---
        Bedöm följande rapportutdrag enligt kriterium T.2 - Syfte:
        Beskriv varför du gör den tekniska utredningen och vad den ska åstadkomma, exempelvis minska
        osäkerhet i planeringen av projektet genom att ta reda på vilken teknisk lösning eller vilket sätt att
        arbeta på som är lämpligast givet projektets förutsättningar. Lyft fram aspekter som är unika med
        projektet. För att ge läsaren läsaren en kontext behöver du beskriv både syftet med projektet syftet
        med den tekniska utredningen.
        Tillvägagångssätt: För att informera läsaren om vad som är tekniskt utmanande i projektet behöver du
        först identifiera unika egenskaper i projektet och vilka svårigheter detta specifika projekt kommer att
        möta i planeringen. Beskriv därefter vad det finns för svårigheter och osäkerheter kring utvecklingen
        av projektet. Motivera vilken/vilka utav svårigheterna som du gör en teknisk utredning kring (för att
        minska osäkerheten), varför just denna/dessa? Dina val ska sedan återspeglas i frågeställningarna.
        Tänk på att: När du skriver vetenskaplig text underlättar det om du utgår ifrån att läsaren alltid är
        starkt skeptisk till allt du skriver och därför måste du motivera dina val för att övertyga läsaren.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
        """,

      "t3": """
        Du är examinator för en universitetskurs.

        ### Exempel 1 - Godkänd
        Text: "Den här utredningen baseras på följande frågeställning:
        Hur påverkar prompt-teknikerna zero-shot prompting, few-shot prompting, chain of thought och instruction-based prompting relevans och pedagogik i en RAG-baserad chattklient som ska användas i utbildningssyfte? "
        Kommentar: "Tydlig och avgränsad frågeställning"
        Betyg: x

        ### Exempel 2 - Nästan godkänd
        Text: "Hur påverkas chattklientenssvar av olika prompting-metoder?"
        Kommentar: "Alltför vagt"
        Betyg: (x)

        ### Exempel 3 - Underkänd
        Text: "Vilken databas är bäst att använda i projektet?"
        Kommentar: "Alldeles för stor och otydlig. Otydligt vilka databaser som ska jämföras och vad som menas med bäst. Frågeställningen bör också vara självbärande undvik ord som projektet"
        Betyg: -

        ---

        Bedöm följande rapportutdrag enligt kriterium T.3 - Vetenskaplig frågeställning:
        Frågeställningen ska vara en tydlig och specifik fråga, formulerad som en riktig mening som avslutas med frågetecken.
        Den ska kunna besvaras i rapportens slutsats, eller det ska tydligt framgå varför den inte kunde besvaras.
        Använd inte vaga eller generella formuleringar, och undvik att hänvisa till delar av rapporten (t.ex. “detta projekt” eller “rapporten”).
        Formuleringen ska vara självbärande, det vill säga begriplig utan att läsaren behöver annan kontext.
        God praxis är att komplettera frågeställningen med ett kort förtydligande: vad den innebär, och hur den kan besvaras.
        En bra frågeställning bygger ofta på en teorigenomgång, så att rätt begrepp och avgränsningar används.
        Ett bra test: Om frågeställningen fortfarande fungerar när du byter ut projektets ämne (t.ex. från spelutveckling till webbportal), då är den troligen för generell.
        Det räcker med en frågeställning, men den bör vara så pass tydlig att den pekar ut en verklig utmaning eller aspekt av arbetet.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
        """
    }
    if assesment_body.title_key in templates:
      return templates[assesment_body.title_key].format(student_paragraph=assesment_body.text)
    else:
      raise ValueError(detail = {"No template for": assesment_body.title_key})
  except Exception as e:
    # Return error
    raise
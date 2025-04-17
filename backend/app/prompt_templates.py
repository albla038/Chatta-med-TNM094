from .models import AssesmentParagraph

def make_prompt_template(assesment_body: AssesmentParagraph):
    template_data = TEMPLATES_DATA.get(assesment_body.title_key)  # KOLLA get???
    if not template_data:
        return "Fel: okänt template-id"

    return BASE_TEMPLATE.format(
        title=template_data["title"],
        description=template_data["description"],
        examples=template_data["examples"]
    )

BASE_TEMPLATE = """
Du är examinator för en universitetskurs.

{examples}

---
Bedöm följande rapportutdrag enligt kriterium {title}:
{description}

Text: "{{student_paragraph}}"

Ge en kommentar och välj ett betyg: -, (x), eller x
"""
TEMPLATES_DATA = """

"""

Templates_Before = {
      "t1": """
        Du är examinator för en universitetskurs.

        ---
        Bedöm följande rapportutdrag enligt kriterium T.1 - Inledning och bakgrund:
        Inledningen presenterar rapportens grund för läsaren och ska därför behandla: bakgrund, motivering,
        syfte, frågeställningar och eventuell avgränsning. Inledningen på en rapport inleder läsaren till rapporten och beskriver den på ett sätt så att läsaren kan få svar på frågor som exempelvis ”Vad är det
        rapporten handlar om?” och ”Vilka frågor kan jag förvänta mig att få svar på om jag läser rapporten?”. Därmed bör man kort beskriva själva projektet och vad som är dess bakgrund, för att läsaren
        ska förstå vad rapporten handlar om, men inte inkludera detaljer ur redogörelse för arbetet. Det som
        besvarar inledningens frågeställningar och syfte ska istället redogöras för i efterföljande kapitel.
        Bakgrund och motivering: beskriv bakgrunden till den tekniska utredningen genom att beskriva projektet, projektets förutsättningar och informera läsaren vad som är tekniskt utmanande. Riktlinlje: ett
        stycke om bakgrunden/problemet och ett stycke om motiveringen. Det som är tekniskt utmanande ska
        leda läsaren till syftet och frågeställningarna som du tänker utreda i kapitel 1.
        I er tekniska utredning är förväntningarna att ni har gjort en utav följande punkter:
        • En litteraturstudie med referenser till vetenskapliga artiklar i syfte att utreda vilken teknisk
        lösning som gruppen bör använda.
        • En litteraturstudie med referenser till vetenskapliga artiklar i syfte att utreda hur gruppen bör
        arbeta.
        • Utvärderat och testat existerande programvaror som ska användas inom projektet för att lösa ett
        problem.
        • Utvärderat och testat existerande bibliotek för att lösa ett problem i projektet.
        • En implementation av en metod som löser ett problem i projektet (notera att detta kan bli för
        omfattande).
        För de två första punkterna beskriver ni vad artiklarna kommer fram till i relation till det ni utreder.
        Med vetenskapliga artiklar menas att de har genomgått en granskning innan de publicerats. För de
        resterande punkterna beskriver ni lämpligtvis någon typ av mätning som resultat (hur lång tid det tar
        att använda dem, hur väl de löser problemet etc.).

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      #t2 - Syfte
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
      #t3 - Frågeställning
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
        """,
      #t4 - Relaterat arbete
      "t4": """
        Du är examinator för en universitetskurs.
        
        ---
        Bedöm följande rapportutdrag enligt kriterium T.4 - Relaterat arbete:
        Beskriv vilka andra arbeten det finns som behandlar liknande frågeställningar. Beskriv kort vad varje
        liknande arbete gör (ca 1-2 meningar/arbete) och hur deras arbeten relaterar till din utredning (ca 1
        mening/arbete). Här bör du refera till minst två arbeten. Totalt bör texten i den här rapporten bestå av
        en till två stycken.
        Notera att det ska finnas mellanslag mellan ord och referens samt att referensen ska ges vid stället
        där påståendet ges eller innan punkt i mening om det är flera påståenden som referar till samma källa
        [här].

        Text: "{student_paragraph}"
        
        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      #t5 - Metod
      "t5": """ 
        Du är examinator för en universitetskurs.

        ---
        Bedöm följande rapportutdrag enligt kriterium T.5 - Metod:
        Beskriv vad som utreds i mer detalj och tillvägagångssättet för utredningen. I tekniska vetenskapliga
        artiklar beskriver man ofta lösningen på problemet man försöker addressera, till exempel en algoritm.
        I det här fallet kan du beskriva de alternativ du jämför och hur du gjort själva jämförelsen. Det ska
        med rimliga medel gå att reproducera resultaten utifrån beskrivningen i metoden. Totalt bör texten i
        den här rapporten bestå av en till tre stycken.
        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      #t6 - Resultat
      "t6": """ 
        Du är examinator för en universitetskurs.

        ---
        Bedöm följande rapportutdrag enligt kriterium T.6 - Resultat:
        Presentera resultaten av utredningen. Notera att resultaten ska presenteras rent faktamässigt och så
        objektivt det bara går. Resultaten ska inte analyseras, diskuteras eller värderas. Detta lämnas till diskussionen.
        I normalfallet ska alternativa lösningar etc. redan ha beskrivits i relaterat arbete eller metod.
        En typisk teknisk vetenskaplig artikel beskriver vilken hårdvara som använts för experimenten och
        kvantitativ mått för olika metoder som utvärderas. Ofta går experimenten ut på att variera parametrar
        som är viktiga för algoritmen.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x      
            """,
      #t7 - Diskussion
      "t7": """ 
        Du är examinator för en universitetskurs.

        ---
        Bedöm följande rapportutdrag enligt kriterium T.7 - Diskussion:
        Tolka och beskriv hur resultaten förhåller sig till frågeställningarna. Gör det lätt för läsaren att förstå
        resultaten genom att beskriva vad resultaten säger.
        Är det en metod som är bättre än en annan?
        Under vilka förutsättningar är en metod bättre och hur kopplar dessa förutsättningar till just ditt projekt?
        Finns det något i resultaten som står ut och behöver analyseras och kommenteras? Till exempel om
        du valt mellan olika metoder/rutiner och fann att de kunde vara bra vid olika tillfällen. Diskutera i
        så fall under vilka förändrade förutsättningar, kopplade till ditt projekt, som dina val skulle kunna ge
        sämre utfall.
        Hur relaterar teorin (vetenskapliga artiklar, böcker, etc.) till resultaten? Finns det något i resultaten
        som är oväntat baserat på teori och andra källor, eller stämmer det bra överens med vad man teoretiskt
        kunde förvänta sig? Försök att generalisera, ifrågasätta, ta ställning och blicka framåt.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      #t8 - Slutsatser
      "t8": """ 
        Du är examinator för en universitetskurs.

        ---
        Bedöm följande rapportutdrag enligt kriterium T.8 - Slutsatser:
        Börja med att sammanfatta syftet och sedan beskriva hur syftet har uppnåtts (ett stycke).
        Notera: Varje frågeställning ska ha ett eget stycke för att tydliggöra strukturen. Glöm inte att påminna läsaren om hur dina frågeställningar löd.
        Beskriv vad svaret på frågeställningarna blev. Beskriv även hur förutsättningarna för projektet passar
        till frågeställningen. Rekommendera läsaren vad den bör välja om förutsättningarna ändras.
        Riktlinje: Några meningar om svaret på frågeställningen och hur det relaterar till förutsättningarna
        för projektet. Några meningar om möjliga konsekvenser av ändringar av förutsättningar och rekommendationer kring val av lösning i de fallen (ska en annan metod användas?). Du kan också ha ett
        stycke om framtida arbete där man beskriver vad man skulle vilja göra om man hade mer tid eller
        som rekommendationer för framtida arbeten. Om man har ett sådant stycke är det dock viktigt att det
        är konkreta och väl genomtänkta förslag som presenteras, snarare än vaga idéer.
        Ta er tid att skriva den här delen, gå tillbaka efter någon dag och ställ dig själv frågan om frågeställningarna är besvarade? Visa den för en kurskamrat eller liknande och låt dem bedöma om du har
        besvarat frågeställningen.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x            
            """,

      ### PROJEKTPLAN SKA IN

      #s - Slutsatser
      "s": """ 
        Du är examinator för en universitetskurs.

        ----
        Bedöm följande rapportutdrag enligt kriterium S - Slutsatser:
        Inled med en översikt över systemet som ska byggas i projektet, dess delar och hur de ska fungera
        tillsammans. Eftersom den individuella rapporten behandlar projektet i ett tidigt skede så kommer
        mycket vara spekulativt, men bör ändå vara realistiskt och välmotiverat.

        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
           """,
      #s1 - Grundläggande krav och systembegränsningar
      "s1": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "s2": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "s3": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "s4": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,

      "p": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
           """,
      "p1": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "p2": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "p3": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "p4": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,

      "r": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
           """,
      "r1": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "r2": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "r3": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "r4": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "r5": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "r6": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,

      "e": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
           """,
      "e1": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """,
      "e2": """ 
        Du är examinator för en universitetskurs.

        
        Text: "{student_paragraph}"

        Ge en kommentar och välj ett betyg: -, (x), eller x
            """
    }
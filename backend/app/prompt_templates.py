from .models import AssesmentParagraph

def make_prompt_template(assesment_body: AssesmentParagraph):
  template_data = TEMPLATES_DATA.get(assesment_body.title_key)
  if not template_data:
    return "Fel: okänt template-id" # GÖR ETT RIKTIGT FELMEDDELANDE

  return BASE_TEMPLATE.format(
    title=template_data["title"],
    description=template_data["description"],
    example_approved=template_data["examples_approved"], 
    example_almost=template_data["examples_almost"],
    example_failed=template_data["examples_failed"],
    student_paragraph=assesment_body.text
  )

BASE_TEMPLATE = """
Du är examinator för en universitetskurs.

---
Bedöm följande rapportutdrag enligt kriterium {title}:
{description}

Rapporten ska vara akademiskt skriven.

Här följer kanske några exempel du kan använda som referens:
Exempel 1 - Godkänd
Exempeltext: {example_approved}
Betyg: x
----------------------------
Exempel 2 - Nästan godkänd
Exempeltext: {example_almost}
Betyg: (x)
----------------------------
Exempel 2 - Nästan godkänd
Exempeltext: {example_failed}
Betyg: -
----------------------------

Studentens stycke: "{student_paragraph}"

Ge en kort kommentar och välj ett betyg: -, (x), eller x.
Om studentens stycke är tillräckligt information, för att det är möjligt, föreslå också en förbättrad verision av stycket som tar hänsyn till mallen.
"""
TEMPLATES_DATA = {
  "Sammanfattning":{
    "title": "Sammanfattning",
    "description": """En sammanfattning ska kort och koncist beskriva och motivera det studerade problemet, metoden
        samt resultat och slutsatser. Arbetets bidrag till huvudområdet ska tydligt framgå. Vad är det rapporten säger om huvudområdet som vi inte visste tidigare? Även om sammanfattningen ligger först i
        rapporten så behöver ni alltid gå tillbaka och justera den när ni är klara med analys och slutsatser.
        Sammanfattningens längd växer med längden på rapporten. I en rapport av denna typ kan den vara
        tre stycken lång: ett inledande motiverar arbetet och beskriver bakgrund och utmaningar, ett sammanfattar de viktigaste delarna i metoden och ett beskriver diskussion och slutsatser. Sammanfattningen
        innehåller inga referenser eller ekvationer. I den här rapporten kan ni lägga upp det enligt nedan
        Första stycket: Beskriv bakgrunden och vilka utmaningar som utreds i rapporten.
        Andra stycket: Sammanfatta de utredningar/jämförelser som har gjorts och kopplar till frågeställningarna. Har du till exempel en frågeställning som handlar om hur en viss typ av kvalité kan säkerställas
        så du sammanfatta vilka olika alternativ som beaktats och deras för- och nackdelar.
        Tredje stycket: Sammanfatta slutsatserna i utredningen. Alltså vilka alternativ som valts samt varför de
        valdes. Dessa slutsatser ska koppla till utmaningarna/frågeställningarna i projektet. Beskriv därefter
        på vilka sätt slutsatserna av utredningen har påverkat projektplanen.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },
  "Teknisk utredning": {
    "title": "1 - Teknisk utredning",
    "description": """Inledningen presenterar rapportens grund för läsaren och ska därför behandla: bakgrund, motivering, "
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
        att använda dem, hur väl de löser problemet etc.).""",
    "example_approved": """ Att använda chattklienter baserade på generativ artificiell intelligens (AI) för att ersätta eller underlätta
        mänskligt arbete blir allt vanligare. Det används till exempel i kundtjänst, utbildning, översättning och
        mycket mer. I utbildning kan en chattklient vara ett verktyg som studenter kan ställa frågor till när en
        undervisare inte finns tillgänglig eller inte lyckas förklara något på ett sätt som studenten förstår. Det
        kan då hjälpa att få en förklaring på ett annat sätt. I det här projektet ska en chattklient utvecklas som
        ett stöd för studenter i kursen TNM094 på Linköpings universitet.
        Traditionella chattklientsmodeller har tillgång till all data som de har blivit tränade på, men har ej
        tillgång till externa informationskällor i realtid. Därmed finns det en risk att de ger utdaterade eller
        felaktiga svar. En teknik som används för att minska risken för dessa typer av fel är retrieval augmented generation (RAG). Med en retrevial-funktion kan chattklienten hämta information även från nya
        källor i realtid. När en användare skriver en fråga till chattklienten hämtas relevant intern data, aktuell
        extern data och chatthistorik.
        Hur chattklienten svarar beror mycket på användarens fråga, som brukar kallas för prompt. Beroende
        på hur tydlig prompten är kommer svarskvaliteten vara bättre eller sämre. Eftersom det kan vara svårt
        att påverka hur användaren ska formulera sin prompt kan istället prompt-tekniker användas för att
        förbättra kommunikationen mellan användaren och språkmodellen som genererar själva svaret. Det
        kan minska risken för feltolkningar och göra att frågan besvaras på ett bra sätt. Det finns många olika
        prompt-tekniker som används och undersöks. Fyra vanliga och välundersökta tekniker är:
        Zero-shot prompting innebär att språkmodellen får en fråga utan några exempel eller ytterligare vägledning, vilket gör tekniken snabb och enkel men med risk för varierande svarskvalitet.
        Few-shot prompting ger modellen några exempel på önskade svar, vilket ökar möjligheten att svaren
        blir mer relevanta och kontextuellt anpassade.
        Chain of thought prompting hjälper modellen att resonera stegvis genom att bryta ned komplexa
        frågor i mindre delar, vilket kan ge mer logiska och pedagogiska svar.
        Instruction-based prompting innebär att modellen får specifika instruktioner för hur svaren ska formuleras, vilket gör det möjligt att styra ton, stil och detaljnivå i svaren för att bättre möta utbildningssyftet. """,
    "example_almost": """ """,
    "example_failed": """ """ 
  },
  "Syfte": {
    "title": "1.1 - Syfte",
    "description": """Beskriv varför du gör den tekniska utredningen och vad den ska åstadkomma, exempelvis minska
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
      starkt skeptisk till allt du skriver och därför måste du motivera dina val för att övertyga läsaren.""",
    "example_approved": """När en chattklient används i utbildningssyfte är det viktigt att den ger relevanta, korrekta och pedagogiska svar. 
      Syftet med den här tekniska utredningen är att undersöka hur olika prompt-tekniker kan
      användas för att optimera svarskvaliteten och pedagogiken i en RAG-baserad chattklient som stödjer
      studenter i kursen TNM094. Fokuset ligger på att jämföra teknikerna zero-shot prompting, few-shot
      prompting, chain of thought och instruction-based prompting för att identifiera hur de påverkar relevans och pedagogik.
      """,
    "example_almost": """Syftet med denna tekniska utredning är att testa olika sätt att skriva prompts till en chattbot som ska användas i en kurs. 
      Vi vill ta reda på vilken teknik som fungerar bäst. 
      Projektet handlar om att förbättra kommunikationen mellan chattboten och användaren.""",
    "example_failed": """Vi ska undersöka hur chattklienter funkar och jämföra olika aspekter. """
},
  "Frågeställning": {
    "title": "1.2 - Frågeställning",
    "description": """Frågeställningen ska vara en tydlig och specifik fråga, formulerad som en riktig mening som avslutas med frågetecken.
        Den ska kunna besvaras i rapportens slutsats, eller det ska tydligt framgå varför den inte kunde besvaras.
        Använd inte vaga eller generella formuleringar, och undvik att hänvisa till delar av rapporten (t.ex. "detta projekt" eller "rapporten").
        Formuleringen ska vara självbärande, det vill säga begriplig utan att läsaren behöver annan kontext.
        God praxis är att komplettera frågeställningen med ett kort förtydligande: vad den innebär, och hur den kan besvaras.
        En bra frågeställning bygger ofta på en teorigenomgång, så att rätt begrepp och avgränsningar används.
        Ett bra test: Om frågeställningen fortfarande fungerar när du byter ut projektets ämne (t.ex. från spelutveckling till webbportal), då är den troligen för generell.
        Det räcker med en frågeställning, men den bör vara så pass tydlig att den pekar ut en verklig utmaning eller aspekt av arbetet.""",
    "example_approved": """ Den här utredningen baseras på följande frågeställning:
    Hur påverkar prompt-teknikerna zero-shot prompting, few-shot prompting, chain of thought och instruction-based prompting relevans och pedagogik i en RAG-baserad chattklient som ska användas i utbildningssyfte? """,
    "example_almost": """ Hur påverkas chattklientenssvar av olika prompting-metoder? """,
    "example_failed": """ Vilken databas är bäst att använda i projektet? """
  },
  "Relaterat arbete": {
    "title": "1.3 - Relaterat arbete",
    "description": """Beskriv vilka andra arbeten det finns som behandlar liknande frågeställningar. Beskriv kort vad varje liknande arbete gör (ca 1-2 meningar/arbete) och hur deras arbeten relaterar till din utredning (ca 1 mening/arbete). Här bör du refera till minst två arbeten. Totalt bör texten i den här rapporten bestå av en till två stycken.
Notera att det ska finnas mellanslag mellan ord och referens samt att referensen ska ges vid stället där påståendet ges eller innan punkt i mening om det är flera påståenden som referar till samma källa [här].""",
    "example_approved": """ """,
    "example_almost": """ Flera arbeten undersöker liknande frågeställningar som den som behandlas i denna studie. Clavié et
        al. (2023) presenterar en studie som undersöker hur olika prompt-tekniker påverkar ett systems förmåga att utföra uppgifter, särskilt inom arbetsmiljöer. De visar hur anpassade prompt-ar kan förbättra
        klassificering av jobbtyper och ger insikter om effektiva tekniker för att anpassa modeller för specifika arbetsuppgifter [4]. Liu et al. (2021) utforskar teorin bakom olika prompt-metoder i NLP (Natural
        Language Processing och erbjuder en genomgång av dessa tekniker, vilket ger en grund för att förstå olika tillvägagångssätt för att styra stora språkmodeller. Deras arbete är relevant eftersom det ger
        teoretisk bakgrund som hjälper till att förstå hur och varför vissa prompt-tekniker fungerar bättre än
        andra [7]. Chen et al. (2024) genomför en omfattande översikt av hur prompt-tekniker kan förbättra
        användarupplevelsen och relevansen av svar i stora språkmodeller [3].""",
    "example_failed": """ """
  },
  "Metod": {
    "title": "1.4 - Metod",
    "description": """Beskriv vad som utreds i mer detalj och tillvägagångssättet för utredningen. I tekniska vetenskapliga artiklar beskriver man ofta lösningen på problemet man försöker addressera, till exempel en algoritm. I det här fallet kan du beskriva de alternativ du jämför och hur du gjort själva jämförelsen. Det ska med rimliga medel gå att reproducera resultaten utifrån beskrivningen i metoden. Totalt bör texten i den här rapporten bestå av en till tre stycken.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """För att undersöka hur de olika prompt-teknikerna påverkar relevans och pedagogik i en RAG-baserad
        chattklient genomfördes en litteraturstudie. För att hitta relevanta artiklar genomfördes en litteratursökning i två databaser: Scopus1 och Google Scholar2
        . Söktermer som användes var bland annat
        Large Language Models", Natural Language Processing", prompt engineering", prompting methods",
        "education". För att säkerställa att artiklarna är aktuella filtrerades resultaten efter publiceringsår (artiklar publicerade de senaste fem åren prioriterades).
 """
  },
  "Resultat": {
    "title": "1.5 - Resultat",
    "description": """Presentera resultaten av utredningen. Notera att resultaten ska presenteras rent faktamässigt och så objektivt det bara går. Resultaten ska inte analyseras, diskuteras eller värderas. Detta lämnas till diskussionen.
I normalfallet ska alternativa lösningar etc. redan ha beskrivits i relaterat arbete eller metod.
En typisk teknisk vetenskaplig artikel beskriver vilken hårdvara som använts för experimenten och kvantitativ mått för olika metoder som utvärderas. Ofta går experimenten ut på att variera parametrar som är viktiga för algoritmen.""",
    "example_approved": """Zero shot prompting: Enligt Liu et al. (2021) kräver zero shot ingen ytterligare vägledning utöver
själva frågan, vilket gör tekniken snabb och enkel att implementera. Studien visar dock att denna
teknik kan resultera i varierande svarskvalitet, speciellt om frågorna är komplexa eller kräver specifik
kontext [7].
Few shot prompting: Chen et al. (2024) lyfter fram att few shot prompting ger LLM exempel på
svarsmönster, vilket kan öka svarens relevans och precision. Resultaten pekar på att few shot är särskilt
användbart när chattklienten ska hantera återkommande typer av frågor. Svaren påverkas mycket av de givna exemplen och om exemplen inte är representativa eller genomtänkta finns det en risk att
modellen ger vinklade eller irrelevanta svar [3].
Chain of thought prompting: Enligt Liu et al. (2021) och ytterligare belyst av Chen et al. (2024),
möjliggör chain of thought att språkmodellen bryter ned komplexa frågor i mindre steg, vilket leder
till logiska och pedagogiska svar. För en chattklient som ska förstå svåra koncept kan denna teknik
hjälpa till att bygga upp resonemang steg för steg, vilket förbättrar förståelsen [3], [7].
Instruction-based prompting: Enligt Clavié et al. (2023), kan Instruction-based prompting ge en hög
grad av kontroll över hur svaren utformas. Genom att ge tydliga instruktioner kan utvecklaren påverka
modellens ton, stil och komplexitet, vilket gör att svaren kan anpassas efter användarens förväntade
förkunskaper [4].
 """,
    "example_almost": """ """,
    "example_failed": """ """
  },
  "Diskussion": {
    "title": "1.6 - Diskussion",
    "description": """Tolka och beskriv hur resultaten förhåller sig till frågeställningarna. Gör det lätt för läsaren att förstå resultaten genom att beskriva vad resultaten säger.
Är det en metod som är bättre än en annan?
Under vilka förutsättningar är en metod bättre och hur kopplar dessa förutsättningar till just ditt projekt?
Finns det något i resultaten som står ut och behöver analyseras och kommenteras? Till exempel om du valt mellan olika metoder/rutiner och fann att de kunde vara bra vid olika tillfällen. Diskutera i så fall under vilka förändrade förutsättningar, kopplade till ditt projekt, som dina val skulle kunna ge sämre utfall.
Hur relaterar teorin (vetenskapliga artiklar, böcker, etc.) till resultaten? Finns det något i resultaten som är oväntat baserat på teori och andra källor, eller stämmer det bra överens med vad man teoretiskt kunde förvänta sig? Försök att generalisera, ifrågasätta, ta ställning och blicka framåt.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },
  "Slutsatser": {
    "title": "1.7 - Slutsatser",
    "description": """Börja med att sammanfatta syftet och sedan beskriva hur syftet har uppnåtts (ett stycke).
Notera: Varje frågeställning ska ha ett eget stycke för att tydliggöra strukturen. Glöm inte att påminna läsaren om hur dina frågeställningar löd.
Beskriv vad svaret på frågeställningarna blev. Beskriv även hur förutsättningarna för projektet passar till frågeställningen. Rekommendera läsaren vad den bör välja om förutsättningarna ändras.
Riktlinje: Några meningar om svaret på frågeställningen och hur det relaterar till förutsättningarna för projektet. Några meningar om möjliga konsekvenser av ändringar av förutsättningar och rekommendationer kring val av lösning i de fallen (ska en annan metod användas?). Du kan också ha ett stycke om framtida arbete där man beskriver vad man skulle vilja göra om man hade mer tid eller som rekommendationer för framtida arbeten. Om man har ett sådant stycke är det dock viktigt att det är konkreta och väl genomtänkta förslag som presenteras, snarare än vaga idéer.
Ta er tid att skriva den här delen, gå tillbaka efter någon dag och ställ dig själv frågan om frågeställningarna är besvarade? Visa den för en kurskamrat eller liknande och låt dem bedöma om du har besvarat frågeställningen.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """,
  },
  "Projektplan": {
    "title": "2 - Projektplan",
    "description": """Notera att varje kapitelinledning (första texten i nytt kapitel) ska guida läsaren in i kapitlet. Undvik att rada upp rubrikerna. I det kapitlet är det alltså bra att nämna att det handlar om att göra en plan, kort beskriva vad projektet ska utreda och vilka förutsättningarna som är viktiga för projektet. Nämn exempelvis antal projektdeltagare, vad de har för tidigare erfarenheter och färdigheter (programmerare, UX, projektledning osv) och vad det finns för resurser och hårdvara tillgängliga. Beskriv intressenterna (kund, slutkund) och vilka förutsättningar som de ger till projektet. Berätta för läsaren om det är något som är extra viktigt eller osäkert för projektet och därför behöver tas hänsyn till i planen.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "System och tekniska lösningar": {
    "title": "2.1 - System och tekniska lösningar",
    "description": """Inled med en översikt över systemet som ska byggas i projektet, dess delar och hur de ska fungera tillsammans. Eftersom den individuella rapporten behandlar projektet i ett tidigt skede så kommer mycket vara spekulativt, men bör ändå vara realistiskt och välmotiverat.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Grundläggande krav och systembegränsningar": {
    "title": "2.1.1 - Grundläggande krav och systembegränsningar",
    "description": """Motivera och beskriv systemets mål och vilka grundläggande krav som sätts för att detta mål ska anses uppfyllt. Här diskuteras även grundläggande systembegränsningar såsom hur många användare som ska kunna nyttja systemet samtidigt, eller hur lång svarstid systemet får ha för att anses fylla målet. Själva kraven kan vara en punktlista.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Målplattform": {
    "title": "2.1.2 - Målplattform",
    "description": """Motivera och beskriv målplattformen, hårdvara/mjukvara/operativsystem hos användarna av systemet, och hur t ex tredje-part-programvara används för att underlätta stödet för eller utvecklingen till målplattformen. Målplattformen motiveras utifrån användarna av projektets resultat. Vad är det för hårdvara/mjukvara/operativsystem som används av de som ska nyttja systemet?""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Grundläggande systemarkitektur": {
    "title": "2.1 3 - Grundläggande systemarkitektur",
    "description": """Motivera och beskriv systemets grundläggande arkitektur, både interna och externa komponenter och noder, hur de viktigaste systemdelarna i sig delas upp i moduler med specifika uppgifter, systemets interna modulers programspråk, behov av ramverk som stödjer denna systemarkitektur eller definierar och bygger upp den.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Utvecklingsmiljö": {
    "title": "2.1.4 - Utvecklingsmiljö",
    "description": """Besvara följande frågor i 2-3 stycken:
- Vad har projektet för förutsättningar kopplade till utvecklingsmiljön?
- Vilka verktyg (såsom IDE, kompilator, debug-verktyg, profileringsverktyg, etc.) och tredjepartsbibliotek fungerar för dessa förutsättningar?
- Vilket utav verktygen löser problemet bäst och varför?
Tänk på: Vad har ditt projekt för olika komponenter och vad behövs för att de ska fungera och kommunicera med varandra?""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Projekthantering": {
    "title": "2.2 - Projekthantering",
    "description": """Sammanfatta kortfattat de förutsättningar i projektet som är relevanta för styrning och samarbete i projektet. Denna text ska leda in läsaren till delarna som ska tas upp i avsnitt 2.2""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Utvecklingsmetodik": {
    "title": "2.2.1 - Utvecklingsmetodik",
    "description": """Besvara följande frågor i 2-4 stycken:
- Vad har projektet för förutsättningar kopplade till utvecklingsmetodik (storlek på projekt, behov av kommunikation med intressenter, längd på projekt, osäkerheter kring specifika lösningar etc)?
- Vilka utvecklingsmetodiker är lämpliga för dessa förutsättningar (använd referenser för att stödja påståenden om lämpliga metodiker)?
- Vilken utav utvecklingsmetodikerna löser problemet bäst och varför?
- Beskriv hur utvecklarna ska använda de olika delarna i den valda utvecklingsmetodiken för just det här projektet.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Organisation": {
    "title": "2.2.2 - Organisation",
    "description": """Motivera och beskriv vilka som ska ingå i projektet, både utvecklare och externa intressenter, deras ansvarsfördelning (och eventuellt hur den är planerad att förändras över tid) och eventuella arbetsgrupper och vilka syften och uppgifter dessa har. Lista varje roll och beskriv den med någon mening eller två.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Tidsplan": {
    "title": "2.2.3 - Tidsplan",
    "description": """Beskriv, diskutera och motivera tidsplan för hela projektet, sprints, möten och milstolpar, inklusive tid för planering och leverans. Alla delarna som beskrivs behöver kopplas till projektet och motiveras utifrån det. Det ska finnas ett GANTT-schema som ger en översikt över tidsplanen.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Milstolpar och leverabler": {
    "title": "2.2.4 - Milstolpar och leverabler",
    "description": """Lista och ge en mer detaljerad beskrivning och motivering av milstolpar och leverabler, såsom rapporter, prototyper och färdigt system. En milstolpe ska handla om något som ska vara klart ett exakt datum och det måste gå att avgöra om det är färdigt. Du måste alltså ange datumet för milstolpen samt beskriva det som ska vara klart på ett sätt som gör att en utomstående kan avgöra om den är avklarad.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner och principer": {
    "title": "2.3 - Rutiner och principer",
    "description": """Sammanfatta i en till två stycken det som är viktigast för läsaren att veta om projektet för att säkerställa ett fungerande samarbete och rätt kvalitet på utveckling och slutprodukt. Tänk genomgående på att en utvecklare som läst detta kapitel ska förstå hur den personen ska arbeta i projektet.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Mötesprinciper och rutiner": {
    "title": "2.3.1 - Mötesprinciper och rutiner",
    "description": """Beskriv vilka typer av möten gruppen kommer att ha och hur dessa ska gå till. Vad finns det för rutiner kring varje möte? Hur lång tid och varför? Kund? Vad finns det för rutiner kring bestämmande (majoritet?) och varför? Andra rutiner kring möten?""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner för kravhantering och -spårning": {
    "title": "2.3.2 - Rutiner för kravhantering och -spårning",
    "description": """Beskriv hur gruppen ska arbeta med kravhantering och eventuellt även kravspårning och vilket teknikstöd som kommer att användas. Med kravspårning avses processer, rutiner och dokumentation som syftar i att ge full kontroll över hur varje enskilt krav implementeras i systemarkitektur, programdesign, programkod, enhetstest, integrationstest och systemtest. Här beskrivs också hur projektet säkerställer synkronisering mellan intressenternas behov och genomförandet.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner för versionshantering": {
    "title": "2.3.3 - Rutiner för versionshantering",
    "description": """Beskriv hur gruppen ska arbeta med versionshantering och vilket teknikstöd som kommer att användas. Beskriv hur versionshanteringen kopplar till utvecklingsmetodiken. Hur och när ska grenar hanteras? Versionshantering för annan dokumentation? Tänk att en utvecklare ska förstå hur det är tänkt att det ska arbetas med versionshantering efter att ha läst detta.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner för systemarkitektur och programdesign": {
    "title": "2.3.4 - Rutiner för systemarkitektur och programdesign",
    "description": """Beskriv och motivera hur gruppen ska arbeta med arkitektur och programdesign. Ska modellering användas? Vilka modelleringstekniker och när i så fall? Tänk på att koppla och och motivera arbetssättet till det som är unikt med just det här projektet.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner för dokumentation": {
    "title": "2.3.5 - Rutiner för dokumentation",
    "description": """Beskriv och motivera hur gruppen ska arbeta med dokumentation av programkod, möten och andra delar av utvecklingsprocessen. Beskriv och motivera även vilket teknikstöd som kommer att användas.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Rutiner för kvalitetssäkring": {
    "title": "2.3.6 - Rutiner för kvalitetssäkring",
    "description": """Beskriv hur gruppen ska arbeta med kvalitetssäkring av programkod (granskning och testning) och vilket teknikstöd som kommer att användas. Vilka typer av tester som ska genomföras i just det här projektet, när och varför? Koppla gärna detta till andra arbetsprocesser/rutiner i kapitlet.""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  },

  "Etisk och samhällelig reflektion": {
    "title": "3 - Etisk och samhällelig reflektion",
    "description": """Det ska ingå ett till två stycken med en diskussion om arbetet i ett vidare sammanhang. Detta är viktigt för att påvisa professionell mognad samt för att utbildningsmålen ska kunna uppnås. Reflektera över vilken påverkan systemet, eller användandet av systemet, kan ha i en större kontext. Finns det problematiker kring om systemet används på ett sätt som inte det inte är ämnat för?""",
    "example_approved": """ """,
    "example_almost": """ """,
    "example_failed": """ """
  }
}
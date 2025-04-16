T3_prompt_template = f"""
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
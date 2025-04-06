# Backend
Skriven i Python med [FastAPI](https://fastapi.tiangolo.com/) som ramverk/webbserver.

### Tekniker & Ramverk
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://pydantic-docs.helpmanual.io/)
- [OpenAI API](https://platform.openai.com/docs/overview)
- [LangChain](https://python.langchain.com/docs/introduction/)
- [Pinecone](https://www.pinecone.io/)

## Filstruktur
```
backend/
├── app/                # Källkod
│   │ 
│   ├── config.py       # Konfigurationsinställningar (för miljövariabler)
│   ├── embeddings.py   # Embeddingmodell-anslutning
│   ├── llm.py          # Språkmodell-anslutning
│   ├── logger.py       # Konfiguration av loggning
│   ├── main.py         # Huvudfil
│   ├── models.py       # Pydantic models
│   ├── services.py     # Tjänster / Route handlers / Business logic
│   ├── utils.py        # Hjälpfunktioner
│   └── vector_db.py    # Vektordatabas-anslutning
│ 
├── .env                # Miljövariabler
├── .gitignore          # Git-ignore
├── app.log             # Loggfil
├── requirements.txt    # pip-beroenden
└── README.md           # Dokumentation
```

## Komma igång
### Köra backend lokalt
För att köra backend lokalt behöver du ha [Python](https://www.python.org/) och [pip](https://pypi.org/project/pip/) installerat.
Börja med att navigera till backend-mappen
```bash
cd backend
```

Skapa en virtuell Python-miljö och aktivera den
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Kontrollera att den virtuella miljön är aktiverad genom att se att `Get-Command python` returnerar en sökväg som innehåller `.venv`.	

Installera senaste versionen av pip
```bash
python -m pip install --upgrade pip
```

Installera alla beroenden och starta servern
```bash
pip install -r requirements.txt
fastapi dev
```

Stäng av servern med `Ctrl + C`.

Avvaktiera den virtuella miljön med
```bash
deactivate
```

> [!NOTE]
> Därefter räcker det att aktivera den virtuella miljön med `.venv\Scripts\Activate.ps1` och starta servern med `fastapi dev`. Stäng av den med `Ctrl + C` och avaktivera den virtuella miljön med `deactivate`.

> [!TIP]
> Om du har problem med att installera beroenden kan det vara bra att köra `pip install --upgrade pip` för att uppdatera pip.

> [!TIP]
> Läs gärna mer om virtuella miljöer i kombination med FastAPI här:
> [FastAPI - Virtual Environments](https://fastapi.tiangolo.com/virtual-environments/)


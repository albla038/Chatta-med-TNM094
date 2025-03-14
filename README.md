# Chatta med TNM094
Kandidatprojekt som ingår i kursen TNM094 på Linköpings universitet.

## Komma igång
### Köra frontend lokalt
För att köra frontend lokalt behöver du ha [Node.js](https://nodejs.org/en/) och [npm](https://www.npmjs.com/) installerat. 
Börja med att navigera till frontend-mappen:
```bash
cd frontend
```

Installera alla beroenden och starta dev-servern:
```bash
npm install
npm run dev
```

> [!NOTE]
> Därefter räcker det att starta dev-servern med `npm run dev`. Stäng av den med `Ctrl + C`.

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

### Rekommenderade VS Code Extensions
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- ES7+ React/Redux/GraphQL/React-Native snippets
- Python (Microsoft)

## Dokumentation
### Frontend mappstruktur
```
frontend/
├── app/                # Källkod
│   ├── globals.css     # Globala CSS-regler
│   ├── layout.tsx      # Huvudlayout / Huvudkomponent
│   ├── page.tsx        # Sidkomponent för "/"-vägen
│   └── components/     # Återanvändbara komponenter
│       └── ui/         # ShadCN UI-komponenter
│   
├── hooks/              # React Hooks
├── lib/                 
│   └── utils/          # Hjälpfunktioner
│
├── eslint-config.mjs   # ESLint-konfiguration
├── next.config.js      # Next.js-konfiguration
├── package.json        # NPM-paket
├── README.md           # Dokumentation
└── tsconfig.json       # TypeScript-konfiguration
```
## Komma igång
### Sätta upp Python-miljö för att köra Python skript
> [!NOTE]
> För tillfället är det bara biblioteket `requests` som används i skriptet. Du kan installera det med `pip install requests` i din globala Python-miljö om du inte vill använda en virtuell miljö.

För att köra skriptet behöver du ha [Python](https://www.python.org/) och [pip](https://pypi.org/project/pip/) installerat.
Börja med att navigera till scripts-mappen
```bash
cd scripts
```

Skapa en virtuell Python-miljö och aktivera den
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
```

För att kolla om den virtuella miljön är aktiverad kan du kontrollera att `Get-Command python` returnerar en sökväg som innehåller `.venv`.

Installera alla beroenden och kör scriptet
```bash
pip install -r requirements.txt
python file-upload.py
```

Avaktivera den virtuella miljön med
```bash
deactivate
```

> [!TIP]
> Om du har problem med att installera beroenden kan det vara bra att köra `pip install --upgrade pip` för att uppdatera pip.
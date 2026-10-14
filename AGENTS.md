# MindOS-Apps — Arbeitsplatz (Training, Küche, Journal)

Hubs aus dem Vault als Web-Apps fürs iPhone, je Hub ein Symbol auf dem Startbildschirm, kein App Store.
**Die Apps haben keinen eigenen Hub-Code.** Sie laden den Hub aus dem Vault-Repo auf GitHub und führen dessen
DataviewJS-Block aus. `app.js` bildet nur die Obsidian-Stellen nach, die die Hubs benutzen, und ist für alle
Apps **eine** Datei.

| | Training | Küche | Journal |
|---|---|---|---|
| Adresse | `/training/` | `/kitchen/` | `/journal/` |
| Hub | `02 Life OS/Training Hub.md` | `02 Life OS/Ernährung/Kitchen Hub.md` | `02 Life OS/Daily Journal.md` |
| Welche Dateien | `window.HUB_APP` in `training/index.html` | `window.HUB_APP` in `kitchen/index.html` | `window.HUB_APP` in `journal/index.html` |
| Handy-Layout | `training/mobil.css` | `kitchen/mobil.css` | `journal/mobil.css` |

Gemeinsam: `app.js`, `basis.css` (Seite, Statusleiste, Einrichten, Leser), `sw.js` (eine Hülle für alle), `vendor/`,
`index.html` (Übersicht mit allen Apps). **Kopfknöpfe** (✕ ‹ ⌄ ✓ in Blatt- und Laufköpfen) sind in beiden Apps 40 px mit Zeichen 20 px, Form über `--kopf-r` in `basis.css` (abgerundet, seit 13.10.). **Blätter wegwischen** (`app.js`, Abschnitt „Blätter: wegwischen mit der ganzen Fläche“, seit `apps-v39`): an der ganzen Fläche von `#tr-dlg` (ohne `.lauf`), `#ml-prep-inner` und seit `apps-v43` dem Leser `#leser .le-blatt` (Rezept-Ansicht, Kochlauf; Wischen = ✕, der Kochlauf pausiert nur; der Leser trägt ebenfalls `.lauf`, ausgenommen ist deshalb ausdrücklich nur `#tr-dlg.lauf`), sobald der scrollbare Bereich unter dem Finger oben steht; sonst scrollt er. Solange ein Blatt offen ist, wird jedes `touchmove` am Hintergrund und am Scrollende im Blatt verhindert. Nach einem Zug wird der folgende Klick geschluckt, **vor dem eigenen Schließ-Klick wird die Sperre aufgehoben** (`apps-v40`: sonst schluckte sie das Schließen, das Blatt sprang zurück). **Entschieden wird beim ersten `touchmove`** (`apps-v41`): Safari legt dort fest, ob es scrollt, ein späterer Eingriff greift nicht mehr. Ohne scrollbaren Bereich unter dem Finger wird jede Bewegung im Blatt verhindert. Eingabefelder sind nur ausgenommen, solange in ihnen getippt wird (fokussiert), sonst sind sie Fläche. Klicks werden nur nach einem Zug über 10 px geschluckt. **Schließen nach Tempo beim Loslassen** (`apps-v42`, wie iOS): Tempo über die letzten 100 ms (`g.spur`), Pause vor dem Loslassen = 0. Zu bei > 0,5 px/ms nach unten (ab 20 px) oder über die halbe Blatthöhe; nach oben (< −0,1) nie. Prüfen mit nachgestellter Uhr (`Date.now` überschreiben), ein Hintergrund-Tab bremst echte Timer auf 1 s. Beim Prüfen mit echtem Zeitablauf ziehen (Pausen zwischen den Ereignissen), ein Zug in einem Rutsch verdeckte den Fehler. Ein neues Blatt bekommt das, wenn es in `BLATT` eingetragen wird. Mit nachgestellten Touch-Ereignissen in Chrome prüfbar (`new Touch`, `new TouchEvent`). Eine neue App = ein neuer Ordner mit `index.html`, `mobil.css`, Manifest, Symbolen
und ein Eintrag in `HUELLE` und in der Übersicht.
Der Schlüssel (`tr-konf`) gilt für beide, alles andere im Speicher trägt das Kürzel der App (`tr-`, `ki-`).

## Gegenstück im Denkraum

- `MindOS/05 Stack/Context/Decisions/Training-App am Handy führt den Hub-Code aus.md`: warum so, was
  am Handy geht und was nicht. **Entscheidungen zur App gehören dorthin.**
- `MindOS/02 Life OS/1. Agent — Life OS.md`, Abschnitt Training Hub: was der Hub-Code einhalten muss,
  damit er auch hier läuft. (Für den Kitchen Hub nachziehen, sobald die Küche ausgerollt ist.)

**Wie sich die Apps anfühlen sollen** (Schließen und Zurück, Gesten, Tastatur, ein Zeichen je Sache) steht in
`MindOS/04 Knowledge/MindOS Design-Prinzipien für Apps.md`. Hier steht nur die Technik dahinter.

## Was beim Ändern zählt

- **Benutzt der Hub eine neue Obsidian-Funktion, stürzt die App ab**, bis sie in `shim()` in `app.js`
  nachgebildet ist. Prüfen mit `grep -o "dv\.[a-zA-Z]*\|app\.[a-zA-Z.]*\|require([^)]*)"` auf den Hub.
- **Das Rad (Wdh × kg , Nachkomma) gehört nur der App** (`radOeffnen` in `app.js`): Es füllt die Felder `.tr-satz .g-w/.g-g`, die der
  Hub zeichnet, und meldet jede Änderung mit einem `input`-Ereignis. **Seit 12.10. Satz für Satz:** ✓ ruft `window.__th.fertig(u, s)`
  (Zeile über `data-u`/`data-s`), ↷ `aus`, der Papierkorb `zurueck`; die Antwort ist die nächste offene Zeile, auf die das Rad springt.
  Drei Walzen: ganze kg 0–300 und `,00/,25/,50/,75`, Werte außerhalb kommen dazu. Kein Abdunkeln, `html.rad-auf` gibt dem Lauf unten Platz.
  Ohne `window.__th` (alter Hub-Stand) schließt ✓ nur. **Seit 13.10. (`apps-v27`):** Eine Zeile mit `data-extra` bekommt im Rad den Mülleimer `.rad-loeschen` (ruft `__th.loeschen`) statt ↷ bzw. Zurücknehmen; `#tr-verwerfen` schließt das Rad wie „Abschließen“. **Seit `apps-v28`:** Der Kreis `.nr` hakt im Hub ab; war das Rad offen, folgt es dem nächsten Satz, ein Satz ohne Werte öffnet es. **Seit 13.10.:** Ein Tipp auf „Abschließen“ (`#tr-abschl`) schließt das Rad, weil der Hub dann einen Dialog über den Lauf legt. Benennt der Hub Klassen oder `__th` um, findet das Rad nichts mehr.
  Was der Hub dabei macht: Abschnitt Training Hub in `MindOS/02 Life OS/1. Agent — Life OS.md`.
- **Schreiben läuft immer über die Warteschlange, streng nacheinander** (`schreiben` → `einreihen` → `abarbeiten`).
  **Sofort anzeigen (seit 09.10.):** `schreiben` kehrt zurück, sobald der Eintrag eingereiht ist; gesendet wird im
  Hintergrund. Der Hub bekommt deshalb keine Fehler mehr zu sehen: Was scheitert, steht oben in der Leiste
  (mit Grund), die Fassung liegt unter `<kürzel>-nicht`, und die Ansicht springt auf den echten Stand zurück.
  `modify` hängt an, wenn der neue Text mit dem alten beginnt, sonst schreibt es um (`art:'ersetzen'`) — mit dem
  sha, auf dem die Änderung beruht. Lehnt GitHub ab (409/422), wird nichts überschrieben: Die Fassung landet unter
  `<kürzel>-nicht` und steht oben in der Leiste. Löschen (`trash`, `trashFile`) genauso, mit sha.
  `processFrontMatter` ändert **nur die betroffene Zeile** (kein Neuschreiben des YAML, sonst Format-Drift).
  Einfache Listen schreibt es seit 14.10. wie Obsidian (`  - wert`, leer `[]`, gebraucht für `habits_archiviert`),
  Verschachteltes verweigert es. Am Hub selbst wirft es: den aktiven Plan stellt nur der Mac um.
  **Schreiblogik geändert? Danach `node werkzeug/schreibtest.mjs`** (schnelle Haken, Funkloch, Mac hat inzwischen
  geändert, Anhängen, alte Einträge ohne id, echter Fehler). Läuft gegen ein nachgebautes GitHub, ohne Netz.
- **Neuaufbau nach dem Schreiben wartet auf den Dialog (seit 11.10.):** `neuStarten` baut erst neu auf, wenn `APP.wartet()`
  nein sagt (Küche: `#ml-prep-modal` offen), höchstens nach 1,6 s. Vorher riss der Neuaufbau den Dialog nach 60 ms weg,
  die Meldung „… eingetragen“ war nie zu sehen. Eine App ohne `wartet` baut wie bisher nach 60 ms neu auf.
- **Safari-Eigenheiten am iPhone (seit 13.10., `apps-v29`):** **Kopfzeilen stehen fest (`fixed`), nicht angeheftet (`sticky`)** (`apps-v30`): Bei `sticky` verlor Safari beim Scrollen nach und nach den Inhalt (erst die Flamme, dann den Chip, dann den Titel), auch mit der Unschärfe auf `::before`. Den Platz hält `--kopf-rest` frei (`apps-v37`): gemessen in `app.js` wird nur die Höhe **unter** dem oberen Polster, den Rand der Statusleiste rechnet das CSS dazu. **Das allein reichte nicht** (`apps-v38`): Beim Start zeichnete Safari den Inhalt trotzdem unter die Kopfzeile, ein Neuaufbau (z. B. Tag verschieben) reparierte es. Deshalb baut `nachbauen()` die Ansicht 0,7 und 2 s nach dem Start einmal neu auf, nur wenn kein Blatt, Lauf, Rad, Leser oder Eingabefeld offen ist. Vorher (`--kopf-h`, ganze Höhe) war die Messung beim Start zu klein, weil Safari den Rand erst später lieferte, der Inhalt steckte unter der Kopfzeile, bis ein Neuaufbau neu maß. **Jedes Kind der Kopfzeile bekommt `transform:translateZ(0)`** (`apps-v33`): Safari (iOS 26) verlor beim Scrollen den normal gezeichneten Inhalt, nur Teile mit eigener Zeichenebene blieben (beobachtet: Chip mit animierter Flamme blieb, Titel verschwand). Die Unschärfe liegt weiter auf `::before`, nie auf der Zeile selbst (Safari 26 färbt seine Leisten nach festen Elementen am Rand). Die Leiste unten: siehe „Kein Zoomen“ weiter unten (iOS-26-Fehler, `--app-h`).
- **Kein Zoomen (seit 13.10.):** `touch-action:pan-x pan-y` in `basis.css` und `gesturestart` abgefangen in `app.js`. **Kein `maximum-scale`/`user-scalable=no` im Viewport** (`apps-v31`): Damit rechnete Safari die Seite in der Startbildschirm-App um die Statusleiste zu kurz (`clientHeight` 762 statt 812), feste Leisten unten schwebten und Kopfzeilen rutschten weg. Der Viewport-Eintrag war es **nicht** (v31 ohne ihn, Fehler unverändert). **Ursache ist ein Fehler von iOS 26:** Eine Startbildschirm-App bekommt beim Start eine um die Statusleiste zu kurze Seite (`innerHeight` 763 statt 812), bis man scrollt. **Deshalb hängt seit `apps-v32` nichts mehr an `bottom:0`:** Leisten, Rad und Blätter stehen von oben mit `--app-h` (`basis.css`, in der App `min(100lvh, 100dvh + Sicherheitsrand oben)`, gesetzt über `html.ios-app`), verankert mit `top:var(--app-h); transform:translateY(-100%)`. **Neue feste Elemente unten genauso bauen.** *(Ein Ausgleich `--doc-versatz` = innerHeight − clientHeight war in `apps-v35` drin und falsch: Er erzeugte eine feste Lücke von genau diesem Betrag. Wieder entfernt in `apps-v36`. Die einmal beobachtete Überlappung des Inhalts unter der Kopfzeile ist ungeklärt.)* Quellen: GitHub-PRs AltanS/collie #355, Mereithhh/very-happy #479. **Eingabefelder mindestens 16 px Schrift** (gemessen 14.10.): Darunter zoomt Safari beim Antippen hinein, `touch-action` verhindert das nicht. **Kein Markieren (seit 13.10.):** `user-select:none` auf `html` in `basis.css`, Eingabefelder ausgenommen.
- **Tastatur am iPhone (seit 11.10.):** Sie verkleinert nur den sichtbaren Ausschnitt, nicht die Seite. Ein Blatt, das unten
  klebt, schrumpft beim Filtern von oben, und das Suchfeld rutscht hinter die Tastatur. `app.js` setzt deshalb `--vv-h`, `--vv-o`
  und `html.tastatur`, die `mobil.css` setzt das Blatt damit fest (Küche: `#ml-prep-modal`). Solange ein Textfeld im Hub den Fokus
  hat, behält `#hub` seine Höhe (Suche in der Seite, sonst springt das Scrollen). **Neues Blatt mit Suchfeld → dieselbe Regel
  in dessen `mobil.css`.** Das Training hat sie seit 13.10. ebenso (Blatt `.tr-modal`, außer beim Lauf, und der Abschließen-Dialog `.tr-ldlg`). **Feld in den Blick (`apps-v44`):** `feldZeigen` in `app.js` scrollt ein fokussiertes Feld in Blättern (`#ml-prep-inner`, `#tr-dlg`, `#leser .le-blatt`) nach 80/350/700 ms in die Mitte seines scrollbaren Bereichs; das Blatt rückte sonst über die Tastatur, das Feld blieb aber unten verdeckt. Ohne iPhone nur nachzustellen: `html.tastatur` und `--vv-h:480px` von Hand setzen, dann tippen und messen.
- **Prüfen ohne echte Daten:** `node werkzeug/testserver.mjs` liest aus dem Vault, Schreiben ist gesperrt. **Port 8787 kann belegt sein**, von einer parallelen Sitzung mit Vault-Kopie: Dann liefert er nicht den aktuellen Hub. Prüfen mit `ps` und eigenen Port nehmen (`PORT=8788 node werkzeug/testserver.mjs`).
  Schreibtests nur gegen eine Kopie: `SCHREIBEN=1 VAULT=/tmp/vault-kopie node werkzeug/testserver.mjs`,
  Funkloch dazu mit `OHNE_NETZ=1`. Bildschirmfoto in iPhone-Breite: `werkzeug/rahmen.html`
  (Testmodus: `?view=plan`, `?klick=Selektor|Selektor=>Wert`; die Küche mit `?app=kitchen`).
- **Laden beim Öffnen:** Ordner aus `ordner` und die Ordner der Einzeldateien werden aufgelistet (liefert den sha
  jeder Datei), geholt wird nur, was sich geändert hat. Über 1 MB liefert GitHub keinen Inhalt mit, dann roh nachgeholt.
  Die Küche lädt so auch den BLS (`99 System/Utility/Views/BLS/bls.json`, 481 KB) nur bei Änderung.
- **Barcode lesen (seit 09.10.):** Der Kitchen Hub liest Barcodes aus Fotos mit `BarcodeDetector`. Safari am iPhone hat das nicht,
  deshalb setzt `app.js` dort eine Klasse gleichen Namens, die beim ersten Foto `vendor/barcode-detector.js` (Ponyfill, MIT) und
  `vendor/zxing_reader.wasm` (rund 1 MB) lädt. **Bewusst nicht in `HUELLE`**: Ohne Netz kann Open Food Facts das Produkt ohnehin nicht
  nennen. **Die `.wasm` muss zur Version passen, die in der `.js` steht** (heute zxing-wasm 3.1.3): Beim Aktualisieren beide aus
  `npm pack barcode-detector` bzw. `npm pack zxing-wasm@<Version>` holen. Prüfen ohne Handy: `werkzeug/barcode-testfoto.py`
  zeichnet einen Strichcode als unscharfes, schräges „Foto“; im Testserver über `DataTransfer` ins Dateifeld `#ml-plan-scan` legen.
- **Journal (seit 14.10.):** Der Hub zeichnet am Handy selbst drei Reiter (`HANDY` im Hub = `app.isMobile` und `window.HUB_APP`,
  Obsidian am iPhone behält die Szene), `journal/mobil.css` macht daraus Kopfzeile, Karten, ganzseitiges Heft, Stempelleiste
  über der Tastatur (`--vv-h`/`--vv-o`) und Leiste unten. Das Heft ist am Handy immer beschreibbar: Safari öffnet die Tastatur nur
  bei einem echten Tipp ins Feld, ein `focus()` nach dem Neuaufbau reicht dort nicht. Für das Journal kamen in `shim()` dazu:
  `dv.date` (nur Tag, plus/minus Tage, `yyyy-MM-dd`, `weekday`), `file.size`, `vault.process`, `APP.bilder` (Heftblatt und
  Schrift stehen in keinem Frontmatter, auch eine `.ttf` geht diesen Weg). Gemessen am iPhone mit `werkzeug/stempeltest.html`:
  `mousedown` + `preventDefault` hält Tastatur und Markierung auch in Safari, die Farbspur liegt ohne Versatz unter dem Text.
- **Bilder** sucht die App im Frontmatter der geladenen Notizen (z. B. `banner:`), holt sie einmal und legt sie
  im Cache-Speicher des Browsers ab (nicht im localStorage, der hat nur wenige MB). Ein Bild, dessen Pfad nicht
  stimmt, fehlt am Handy genauso wie im Hub am Mac.
- **Nach Änderungen an der Hülle** in `sw.js` die Version `V` hochzählen. Am iPhone kommt eine Änderung
  beim **zweiten** Öffnen an (erst lädt die App die neue `sw.js`, dann damit die neuen Dateien). GitHub Pages
  lässt Dateien 10 Minuten zwischenspeichern; `sw.js` fragt deshalb mit `cache:'no-cache'` jedes Mal nach.
- **App-Symbole nur aus `icon-512.png` verkleinern** (`sips -z 180 180 training/icon-512.png --out training/icon-180.png`), nie direkt
  per Chrome-Screenshot erzeugen: Chrome öffnet kein Fenster unter ~500 px, kleine Symbole zeigen dann nur den
  linken Rand des Motivs (passiert am 08.10.). Nach neuem Symbol `?v=` in `index.html` und Manifest hochzählen,
  am iPhone das Symbol löschen und neu „Zum Home-Bildschirm“ — iOS übernimmt es nur beim Hinzufügen.
- Ausgeliefert über GitHub Pages (`kuyajstn/mindos-apps`, bis 09.10. `kuyajstn/Training`; öffentlich — der Code enthält keine Daten
  und keinen Schlüssel; der Schlüssel liegt nur im Browser des Handys).

## Küche: Stand (09.10.)

Viermal so groß wie der Training Hub (324 KB) und mit Schreibwegen, die die App heute verweigert:
`processFrontMatter` (3×, u. a. `done`-Toggle am Meal Plan, `pause` an der Daily Note), `vault.modify` mit
Umschreiben statt Anhängen (5×, z. B. `Zutaten Check`, `Einkaufsliste`, `Reste Ablage`), `trash`/`trashFile`,
`metadataCache.getFileCache` (Überschriften von `Vorrat.md`), `getResourcePath` (Bilder), `executeCommandById`.
Liste neu erzeugen: `grep -o "dv\.[a-zA-Z]*\|app\.[a-zA-Z.]*\|require([^)]*)" "MindOS/02 Life OS/Ernährung/Kitchen Hub.md" | sort | uniq -c`.
Entschieden (Justin, 09.10.): **Umschreiben mit sha-Prüfung, auch aus der Warteschlange.** In `app.js` gebaut,
dazu der Spielstand jede Minute und eine Ansage, wenn das Zusammenführen scheitert.
**Ausgerollt am 09.10.** (`https://kuyajstn.github.io/mindos-apps/kitchen/`): alle Stellen nachgebildet, Handy-Layout (Leiste unten, Kopf
angeheftet, Dialog als Blatt; **seit 10.10.** ohne den Kopf „Kitchen“ mit Glocke, angeheftet ist die Tageszeile `.kt-top` des Tagebuchs), Symbol `kitchen/icon-*.png` (Quelle `werkzeug/icon-kitchen.html`, fotografiert mit
headless Chrome: `--headless=new --window-size=512,512 --screenshot=…`, das geht auch unter 500 px). Mit dem echten
Hub gegen eine Kopie geschrieben: anlegen, „gegessen“ umschalten, Favorit, entfernen.
**Leser** (`leserOeffnen` in `app.js`): Am Mac öffnet der Hub Notizen in Obsidian, am Handy zeigt die App sie selbst
als Blatt. Haken an Zutaten und Schritten nur zum Mitkochen (nicht gespeichert), Bildschirm bleibt an (Wake Lock). **Rezepte (`type: recipe`) als Kochansicht** (seit 10.10., `kochteile`): Abschnitte mit 🛒/🔥/📦 bzw. Zutaten, Zubereitung, Bausteine, Produkt oben, alles andere eingeklappt unter „Werte und Notizen“. `video:` am Rezept wird ein Knopf (YouTube, TikTok, Instagram). **Kochlauf** (seit 10.10., `kochlaufOeffnen`): Lesen → „Kochen starten“ → Wählen → Vorbereiten und Kochen mit zwei Balken → „Als gegessen eintragen“. Rechnung und Eintragen kommen vom Hub über `window.__kh` (fehlt es, zeigt der Leser die Kochansicht wie vorher), Stand unter `ki-lauf:<Pfad>`, verfällt nach 12 Stunden. ✕ pausiert, ‹ geht zurück, zurück zum Lesen beendet den Lauf (mit Haken erst beim zweiten Tipp). **Meal Prep** (seit 10.10.): „Gekocht für N“ bei Wählen, Mengen × N beim Vorbereiten (`mengenImTopf`), am Ende `__kh.eintragen(…, { rest })` oder `__kh.ablegen`. **Scrollposition je Reiter** (seit 10.10., `nachStart` in `kitchen/index.html`): Jeder Reiter merkt sich seine eigene, sonst übernahm Planen die des langen Tagebuchs. **Gezeichnet mit den Klassen des Hubs** (Blatt mit `.kh`, Symbole aus `window.__kh.ikon`), nie nachbauen: Eine nachgebaute Fassung lief am 10.10. sofort auseinander. Eigenes CSS in `kitchen/mobil.css` nur für Blatt, Balken und Fuß. Warum: `MindOS/05 Stack/Context/Decisions/Kochansicht statt ausgelagerter Notizen.md`.
**Vor dem Ausrollen prüfen:** Jede Datei aus `HUELLE` in `sw.js` muss existieren, sonst scheitert die Installation, und
auch das Training verliert seinen Offline-Stand.
Am Handy bewusst nicht: die offenen Tasks zum Hub (`01 Action` wird nicht geladen). **„Beschreiben“ geht seit 09.10.**: ohne Claudian, als
Eintrag, der auf Werte wartet (Kitchen Hub, Stufe 3). Dafür hat `shim()` `app.isMobile = true` (der Hub fragt danach) und
`vault.createBinary`: Das Foto liegt sofort im Bilder-Speicher und geht als `art:'bild'` (schon Base64, nicht im Text-Cache) durch die
Warteschlange, vor dem Eintrag, der darauf zeigt. Scheitert es, ist nur das Foto weg, nicht der Eintrag.
Entschieden (Justin, 09.10.): **Am Handy je Hub eine eigene App** mit eigenem Symbol, kein Umschalter. Der Nachbau von Obsidian (`shim()`) wird trotzdem geteilt, nicht kopiert.

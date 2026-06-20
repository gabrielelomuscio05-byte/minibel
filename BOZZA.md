# Bozza del Sito Web - Colorificio

Questa è una bozza interattiva per il sito web del Colorificio, progettata con un'estetica **Dark Mode Premium** (stile galleria d'arte moderna) per far risaltare al massimo i prodotti, i colori e le texture.

---

## 🖥️ Come Ottenere l'Esperienza di Visualizzazione Migliore

Per apprezzare al meglio le animazioni avanzate e il layout premium di questo sito, ti consigliamo di seguire queste linee guida:

1. **Browser Consigliati**:
   - Google Chrome, Apple Safari, o Mozilla Firefox (aggiornati all'ultima versione).
   - Assicurati che l'**accelerazione hardware** sia attiva nelle impostazioni del browser (essenziale per la fluidità degli shader WebGL e dei filtri SVG).

2. **Risoluzione dello Schermo**:
   - Il layout è completamente responsive e supporta schermi Mobile, Tablet e Desktop.
   - Per l'esperienza desktop ottimale, è consigliato uno schermo con risoluzione minima di **1920x1080**.

---

## 🎨 Principali Funzionalità Interattive da Testare

Quando navighi all'interno della bozza, assicurati di provare le seguenti sezioni:

### 1. Sfondo Animato nella Hero (Home)
- All'apertura del sito, vedrai uno sfondo WebGL interattivo a spirale cromatica fluida che simula la miscelazione di vernici colorate. È progettato per essere elegante e non distrarre l'attenzione dal testo.

### 2. Il Simulatore di Colore (Vernici)
- Scorri fino alla sezione **Prodotti** e fai clic sulla card **"Vernici & Pitture"**.
- Si aprirà la pagina di dettaglio del colore con un simulatore interattivo basato su HTML5 Canvas:
  - Fai clic sulle card dei colori in fondo per cambiare la vernice attiva.
  - Sotto il simulatore, seleziona la vista **"Interno"** per vedere l'animazione di tinteggiatura di una stanza con il rullo.
  - Seleziona la vista **"Esterno"** per vedere il rendering 3D-isometrico di una villa moderna e l'animazione a spruzzo dell'aerografo, che rilascia una nebbia di particelle del colore scelto.

### 3. La Sezione "Recensione Clienti"
- Scorri fino alla sezione delle recensioni (ora linkabile direttamente anche dalla Navbar).
- Fai clic sulle frecce avanti/indietro nel carosello per testare il sistema di **scorrimento a contro-rotazione** (mentre la colonna centrale dei ritratti scende, le colonne esterne salgono).
- Nota l'animazione dei testi: i caratteri delle citazioni e degli autori compaiono salendo uno alla volta con un effetto stagger ritmico e fluido.

---

## 📂 Struttura della Bozza
- **Design System**: Mappato su variabili CSS (`--bg-main`, `--bg-surface`, `--accent-cta`, `--accent-link`) per garantire consistenza cromatica al 100%.
- **Prestazioni**: Il codice è compilato ed ottimizzato senza l'uso di librerie esterne pesanti per i bottoni o per il carosello, mantenendo le animazioni fluide a 60fps.

# FitTrack PWA 🔥

App per tracciare i tuoi allenamenti quotidiani con streak, calorie e km.

## 📲 Come installare su Android

### Step 1 — Carica su GitHub Pages

1. Vai su [github.com](https://github.com) e fai login
2. Clicca **"New repository"** (+ in alto a destra)
3. Nome repo: `fittrack` (o qualsiasi nome)
4. Metti **Public** ✅
5. Clicca **"Create repository"**

### Step 2 — Carica i file

Nella pagina del repo appena creato:
1. Clicca **"uploading an existing file"**
2. Trascina dentro **tutti i file** di questa cartella:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - cartella `icons/` con `icon-192.png` e `icon-512.png`
3. Clicca **"Commit changes"**

### Step 3 — Attiva GitHub Pages

1. Vai su **Settings** del repo
2. Scorri fino a **Pages** (menu laterale)
3. Source: seleziona **"Deploy from a branch"**
4. Branch: **main** → cartella: **/ (root)**
5. Clicca **Save**
6. Aspetta 1-2 minuti → il tuo link sarà tipo:
   `https://tuousername.github.io/fittrack`

### Step 4 — Installa sul telefono

1. Apri **Chrome** su Android
2. Vai al tuo link GitHub Pages
3. Comparirà un banner **"Installa FitTrack"** → toccalo!
4. Oppure: menu Chrome (⋮) → **"Aggiungi a schermata Home"**

✅ L'app apparirà nella home come una vera app!

## 🔒 I dati sono al sicuro?

- I dati sono salvati nel **localStorage** del browser
- Installata come PWA, Chrome **non cancella** il localStorage dell'app installata anche svuotando la cache normale
- Usa **"Esporta backup"** ogni settimana per avere una copia di sicurezza extra

## ✨ Funzionalità

- 🔥 Streak giornaliero (tipo Duolingo)
- 📊 Recap settimanale con kcal, sessioni e km
- 🏃 Log corsa con km/metri percorsi
- 🏋️ Log palestra
- 💾 Export/Import backup JSON
- 📴 Funziona offline

# ⚡ linvoice — Podsumowanie Projektu (Project Handoff Summary)

> **Kompletny dokument stanu projektu linvoice przygotowany do kontynuacji prac w nowej konwersacji.**  
> **Repozytorium GitHub:** [https://github.com/Diabue/Linvoice.git](https://github.com/Diabue/Linvoice.git)  
> **Ostatni Commit:** `e3327a0` (main)

---

## 📌 1. Cel i Przeznaczenie Aplikacji

**linvoice** to nowoczesna, szybka aplikacja mobilna i webowa stworzona specjalnie dla fachowców w terenie (hydraulików, elektryków, stolarzy, ekip wykończeniowych). 

Pozwala na:
1. Wystawienie wyceny lub faktury w **30 sekund z poziomu telefonu na budowie**.
2. Automatyczne zaciąganie danych firm po NIP z **GUS / Ministerstwa Finansów**.
3. Dodawanie **własnego logo firmy** i wygenerowanie eleganckiego pliku PDF w międzynarodowym szablonie **Payt**.
4. Wygodne rozliczanie przelewami bankowymi, kartą lub gotówką na miejscu.
5. Prowadzenie darmowego 3-dniowego okresu testowego z pełnym systemem subskrypcji PRO i możliwością rezygnacji.

---

## 🚀 2. Zrealizowane Funkcje & Komponenty

### 🛠️ A. Kreator Faktur i Wycen (`InvoiceBuilderModal.tsx`)
- **3-krokowy wizard:**
  - **Krok 1:** Przełącznik dokumentu (`Wycena / Oferta` vs `Faktura VAT`), wyszukiwanie NIP w GUS/MF, oraz **pełny widoczny formularz danych klienta** (Nazwa, NIP, Adres, Kod pocztowy, Miasto, Telefon, E-mail).
  - **Krok 2:** Szybki cennik usług z przyciskami `+` / `-` do dostosowywania ilości na żywo u klienta oraz wpisywanie pozycji niestandardowych.
  - **Krok 3:** Automatyczne wyliczenia netto, VAT i brutto oraz wybór sposobu płatności (`Przelew`, `Gotówka`, `Karta`).

### 📄 B. Generator Faktur PDF (`pdfGenerator.ts`)
- **Szablon w stylu Payt:**
  - Dwukolumnowy blok adresowy `Do (Nabywca)` oraz `Od (Sprzedawca)`.
  - Obsługa **własnego logo wykonawcy** (wgrywanego w profilu w formacie PNG/JPG) lub domyślny badge **linvoice**.
  - Tabela pozycji z ciemnymi akcentami i czytelnym podsumowaniem kwoty brutto.
  - **Brak nachodzenia tekstów:** Poprawione marginesy i odległości X/Y.
  - **Kodowanie znaków:** Pomocnik `latinize()` usuwa uszkodzone krzaki i nawiasy kwadratowe na standardowym foncie Helvetica.
  - **Pancerne pobieranie:** Zapis z wymuszonym rozszerzeniem `.pdf` (np. `FAKTURA_FV_2026_08_004.pdf`).

### 🏢 C. Zaciąganie danych z GUS / MF (`storage.ts`)
- Hybrydowe pobieranie: Zapytanie na żywo do API Ministerstwa Finansów (`https://wl-api.mf.gov.pl/api/search/nip/`) z automatycznym uzupełnianiem formularza w 0.2s + awaryjna generatoria firm przy braku zasięgu.

### 💼 D. Profil i Logo Firmy (`ProfileModal.tsx`)
- Wgrywanie pliku z logo firmy z podglądem na żywo i możliwością usunięcia.
- Edycja danych firmowych, numeru konta IBAN, adresu i maila.

### 🔒 E. Subskrypcja PRO & 3-Dniowy Trial (`PaywallModal.tsx`)
- **Darmowy trial na 3 dni** bez podawania karty na starcie.
- Licznik odliczania na pulpicie i w menu bocznym (`SidebarDrawer.tsx`).
- Modal Paywall z wyborem planów:
  - **Rocznie:** 39 PLN / mies (-25%)
  - **Miesięcznie:** 49 PLN / mies
- ** Retention Cancel Flow:** Pełny mechanizm rezygnacji z subskrypcji z ekranem ostrzegawczym i przyciskiem anulowania.

### 🌐 F. Kompatybilność z Cloudflare Pages & Mobile
- Zbudowane na stabilnym **Vite 5.4.11 + React 19 + TypeScript**.
- Dodane pliki konfiguracyjne: `.nvmrc` (Node 22), `public/_redirects` (SPA fallback 200).
- Włączona obsługa testowania w lokalnej sieci Wi-Fi na telefonie (`vite --host`).

---

## 🛠️ 3. Stos Technologiczny (Tech Stack)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "jspdf": "^4.2.1",
    "lucide-react": "^1.33.0",
    "canvas-confetti": "^1.9.4"
  },
  "devDependencies": {
    "vite": "^5.4.11",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2"
  }
}
```

---

## 📁 4. Struktura Projektu

```text
invoice/
├── public/
│   ├── _redirects              # SPA Fallback dla Cloudflare Pages
│   └── screenshots/            # Zrzuty ekranu do README.md
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Górny pasek z nawigacją i awatarem
│   │   ├── SidebarDrawer.tsx   # Menu boczne z licznikiem trialu
│   │   ├── DashboardView.tsx   # Pulpit KPI, przycisk +Nowa wycena, lista faktur
│   │   ├── InvoiceBuilderModal.tsx # 3-krokowy kreator wycen/faktur z GUS
│   │   ├── InvoiceDetailModal.tsx # Podgląd faktury, przelew, pobieranie PDF
│   │   ├── ServiceCatalogModal.tsx # Zarządzanie cennikiem usług
│   │   ├── ClientsModal.tsx    # Baza klientów z zaciąganiem NIP
│   │   ├── ProfileModal.tsx    # Edycja danych firmy i logo PNG/JPG
│   │   └── PaywallModal.tsx    # Ekran subskrypcji PRO i anulowania
│   ├── services/
│   │   └── storage.ts          # Persistence LocalStorage + API GUS/MF
│   ├── utils/
│   │   └── pdfGenerator.ts     # Szablon PDF w stylu Payt + latinize
│   ├── types/
│   │   └── index.ts            # Definicje TypeScript
│   ├── App.tsx                 # Root coordinator
│   └── index.css               # Design system i mobile UI
├── .node-version              # Node 22.12.0 dla Cloudflare
├── .nvmrc                     # Node 22 dla Cloudflare Pages
├── package.json
└── README.md                  # Dokumentacja GitHub ze zrzutami ekranu
```

---

## 💻 5. Jak uruchomić projekt lokalnie

```bash
# 1. Klonowanie repozytorium
git clone https://github.com/Diabue/Linvoice.git
cd Linvoice

# 2. Instalacja zależności
npm install

# 3. Uruchomienie serwera deweloperskiego dla PC i telefonu (Wi-Fi)
npm run dev

# 4. Budowanie paczki produkcyjnej
npm run build
```

---

## 🚀 6. Plany i Sugestie na Następne Kroków (Roadmap for Tomorrow)

1. **Integracja z bramką płatności (Stripe / PayU / Przelewy24):** Podpięcie prawdziwego przetwarzania kart i płatności pod subskrypcję PRO.
2. **Generowanie kodu QR Przelewu na PDF:** Dodanie obrazka QR do szybkiego skanowania faktury aplikacją bankową klienta.
3. **PWA (Progressive Web App):** Dodanie `manifest.json` oraz Service Workera, aby aplikację można było zainstalować na telefonie jak natywną ze sklepu App Store / Google Play bez przeglądarki.
4. **Wysyłka e-mail bezpośrednio z aplikacji:** Podpięcie usługi typu Resend / SendGrid do wysyłania faktury PDF na maila klienta jednym kliknięciem.

---

*Dokument wygenerowany automatycznie dla projektu linvoice.*

# IEE1030 Skeemitehnika Lõpparuanne

**Projektid:**
- Arduino Nano digisisendi laiendus
- Valgustugevuse mõõtmine fotodioodiga

**Autorid:** Uko, Jüri

**Juhendajad:** Kaiser Pärnamets, Andres Eek

**Tallinna Tehnikaülikool, 2025**

---

## 1. Sissejuhatus

Käesolev aruanne kirjeldab kahe skeemitehnika projekti läbiviimist IEE1030 aine raames. Esimene projekt keskendub Arduino Nano digitaalse sisendi laiendamisele analoogkomponentidega, teine projekt valgustugevuse mõõtmisele fotodioodiga vahemikus 300-500 luksi.

---

## 2. Komponentide testimine

### 2.1 Kohvri sisu ülevaade

Projekti jaoks oli saadaval järgmine komplekt:

| Nimetus | Kogus |
|---------|-------|
| Arduino Nano With Headers + USB kaabel | 1 |
| LM324N Quad op amp (bipolar) | 1 |
| MCP6002 Dual op amp (CMOS) | 1 |
| MCP4802 Dual 8-bit DAC, SPI liides | 1 |
| LED punane/kollane 5mm, 20mA | 5+5 |
| 2N3904 NPN transistor | 5 |
| 2N3906 PNP transistor | 5 |
| 1N4148 Diood | 5 |
| BZX79-C3V9 Zener-diood (3,9V) | 3 |
| TMP36 Temp sensor | 1 |
| BPW34 Fotodiood 850nm | 1 |
| SN74LS02N NOR loogikaskeem | 3 |
| SN74LS00N NAND loogikaskeem | 3 |
| Kondensaatorid: 22pF, 100nF, 1µF, 10µF, 100µF | 5 tk igaüks |
| 100mH Induktiivpool | 1 |
| Surunupud | 5 |
| Takistid: 100Ω, 220Ω, 1kΩ, 4.7kΩ, 10kΩ, 47kΩ, 100kΩ, 1MΩ | 5-20 tk |
| 10kΩ trimmer potentsiomeeter | 5 |
| Breadboard 830 points | 1 |
| DC power supply 9-12V → 5V/3.3V | 1 |
| 9V patarei + karp | 1 |

### 2.2 Testimise metoodika

Komponente testiti järgmiselt:
- **Takistid:** mõõdetud multimeetriga, võrreldi nimiväärtusega (±1% tolerants)
- **LED-id:** testitud 5V toitel läbi 220Ω või 1kΩ takisti
- **Transistorid:** kontrolliti dioodirežiimis multimeetriga BE ja BC siirdeid
- **Op-ampid:** testiti voltage follower konfiguratsiooniga
- **Fotodiood BPW34:** testiti pöördpingestatud režiimis valgustundlikkust
- **Surunupp:** multimeetriga testitud juhitavuse režiimis
- **SN74LS02N NOR** ja **SN74LS00N NAND:** testitud loogikafunktsiooni järgi. Loogikafunktsiooni väljundi jälgimiseks kasutati LED-i ja toiteks Arduinot.
- **1N4148 diood:** multimeetriga mõõdetud dioodrežiimis anoodi ja katoodi pealt

1N4148 diood – multimeetriga mõõdetud dioodrežiimis anoodi ja katoodi pealt
2N3904 NPN transistor – multimeetriga mõõdetud dioodrežiimis baas-emitter ja baas-kollektor siirdeid.
Takistid – multimeetriga mõõdetud takistirežiimis.
Surunupp – multimeetriga testitud juhitavuse režiimis.
SN74LS02N NOR ja SN74LS00N NAND loogikaskeemid – testitud loogikafunktsiooni järgi. Loogikafunktsiooni väljundi jälgimiseks kasutati LED-i ja toiteks Arduinot.



---

## 3. Projekti valik ja motivatsioon

### 3.1 Projekt 1: Arduino Nano digisisendi laiendus

**Püstitus:** Luua skeem, mille sisendiks on 2 digitaalset signaali:
1. Mehaaniline kontakt (Active Low)
2. Digitaalne signaal (Active High)

Skeem peab käituma kui OR-värav, arvestades inverteeritud sisendiga.

**Motivatsioon:** Soov õppida loogikaväravate realiseerimist diskreetsete komponentidega ning mõista, kuidas Arduino sisendeid saab laiendada ilma täiendavate mikrokontrolleriteta.

### 3.2 Projekt 2: Valgustugevuse mõõtmine fotodioodiga

**Püstitus:** Koostada skeem, mis hindab valgustatust vahemikus 300-500 luksi, kasutades kolme LED-i:
- Punane: valgustatus alla 300 lx
- Kollane: valgustatus 300-500 lx
- Roheline: valgustatus üle 500 lx

**Motivatsioon:** Praktiline rakendus valgustingimuste hindamiseks, kasutades ainult analoogkomponente (Arduino välistatud).

### 3.3 Uuritud lahendused

#### Analoogprojekt - kolm lahendust:

1. **MCP6002 kahe op-ampiga:**
   - Üks op-amp voolu-pinge muunduriks (transimpedantsivõimendi)
   - Teine op-amp komparaatoriks
   - *Probleem:* ainult 2 op-ampi, vaja vähemalt 2 komparaatorit

2. **LM324 nelja op-ampiga:**
   - Üks transimpedantsivõimendiks
   - Kaks komparaatoriks (läved 300 lx ja 500 lx)
   - Üks LED-draiver või lisavõimendus
   - *Valitud lahendus*

3. **Takistiredel + komparaatorid:**
   - Pingejagurist referentspinged
   - Voltage-to-LED array stiilis lahendus
   - *Kombineeriti lahendusega 2*

#### Digiprojekt - kolm lahendust:

Esialgu koostati tõeväärtustabel ja leiti minimaalne DNF (disjunktiivne normaalkuju), mis näitab, mis ventiile on vaja. Sobib ka inverteeritud väljund, sest ühendades selle Arduino sisendiga saab loogikat programmaatiliselt vastupidiseks muuta, seega $\overline{A \cdot \overline{B}} = \overline{A} + B$ (De'Morgan'i seadus). Kokku on 2 võimalikku skeemilahendust: OR-venttil inverteeritud A-sisendiga või NAND-venttil inverteeritud B-sisendiga. Antud projektis uuriti kahte loogika perekonda: transistor-takisti (RTL) ja transistor-transistor (TTL) loogikat. RTL kasutab bipolaartransistoreid (BJT), TTL samuti bipolaartransistoreid, ning võrdluseks uuriti ka CMOS-transistoridega lahendusi, kuigi päriselt CMOS'ga makettplaadil pole proovitud, kuna kohvris olid ainult bipolaar.

**Tõeväärtustabel:**

| A (lüliti) | B (signaal) | Väljund |
|------------|-------------|---------|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Minimaalne DNF:** A' + B

Lahenduste valikul toetuti lihtsamatele lahendustele, mida saaks kiiresti kokku panna kasutades käepäraseid komponente. TTL on antud ülesande jaoks ülepingutatud lahendus - see kasutab rohkem komponente kui RTL ja on mõeldud suuremate süsteemide jaoks. Üks karakteristikuteks on 'fan-out', mis tähendab, kui palju järgmise astme väravaid saab ühe värava väljundiga koormata. Võrreldes RTL-iga (lülitusaeg ~12 ns, fan-out 5, müramarginaal 0.2 V) [[rtl-source]] pakub TTL paremat jõudlust: kiirem lülitusaeg (~10 ns)[[ttl-source]], suurem fan-out (kuni 10 väravat) ja sama mürasisekindlus (0.4 V). RTL piisab aga täielikult lihtsa 2-sisendiga loogikafunktsiooni teostamiseks, kus ei ole vaja kiireid lülitumisi ega suurt koormust ajada, mistõttu valiti RTL lahendus kui praktiline ja minimaalsete komponentidega variant.

1. **Dioodidega OR-värav + transistor-inverter**
   - Lihtne, vähe komponente
   - *Miinus:* dioodi pingelang vähendab väljundit
   - Kasutatakse tihti toidete kombineerimiseks, nt. Arduino $V_{in}$ ja 5 V on ühendatud dioodidega.

2. **Transistoritega NOR/OR**
   - Väljund otse toitega ühendatud (NOR)
   - fan-out 5
   - müramarginaal 0.2 V
   - *Valitud testimiseks*

3. **Ainult integraalskeemidega (74LS02 NOR / 74LS00 NAND)**
   - Puhas digitaallahendus, TTL perekond
   - Kiirem lülitusaeg (~10 ns), parem fan-out (10)
   - parem müramarginaal (0.4 V)

---

## 4. Plokkdiagrammid

### 4.1 Analoogprojekt: Valgustugevuse mõõtja

```
┌─────────────┐    ┌────────────────┐    ┌─────────────────┐    ┌──────────┐
│   BPW34     │───▶│  Transimpedants│───▶│   Komparaatorid │───▶│   LED    │
│  Fotodiood  │    │   võimendi     │    │   (2 lävendit)  │    │  Array   │
│             │    │   (LM324)      │    │    (LM324)      │    │ R/Y/G    │
└─────────────┘    └────────────────┘    └─────────────────┘    └──────────┘
                                                │
                   ┌────────────────┐           │
                   │ Referentspinge │───────────┘
                   │   redel        │
                   │ (R1-R2-R3-R4)  │
                   └────────────────┘
```

### 4.2 Digiprojekt: Sisendi laiendus

```
┌──────────────┐         ┌───────────┐
│  Mehaaniline │────────▶│           │
│    lüliti    │   A'    │           │
│ (Active Low) │─────┐   │    OR     │────▶ Arduino
└──────────────┘     │   │   värav   │      digitaalne
                     ▼   │           │      sisend
              ┌──────────┐           │
              │ Inverter │───────────┤
              │  (NPN)   │           │
              └──────────┘           │
┌──────────────┐                     │
│  Digitaalne  │─────────────────────┘
│   signaal    │   B
│ (Active High)│
└──────────────┘
```

---

## 5. Simulatsioon

### 5.1 Analoogprojekt - LTspice simulatsioon

**Skeemi kirjeldus:**

Skeem koosneb kolmest põhiosast:
1. **Transimpedantsivõimendi:** BPW34 fotodiood pöördpingestatud režiimis, LM324 op-amp tagasiside takistiga 500kΩ
2. **Pingeredel:** Referentspingete genereerimine V1=3.25V (500 lx), V2=1.7V (300 lx), V3≈0.1V
3. **Komparaatorid:** Kaks LM324 op-ampi komparaatoritena

**Takistiredeli arvutuskäik:**

Mõõdetud seos (500kΩ tagasisidega):
| Lux | V(out) |
|-----|--------|
| 300 | 1.70 V |
| 500 | 3.25 V |

Pingeredeli valemid (R1-R4 jadaühenduses, Vin=5V):

$$
\begin{aligned}
R_1 &= R_{tot} \cdot \frac{V_{in} - V_1}{V_{in}} = 100k \cdot \frac{5-3.25}{5} = 35.0\,k\Omega \\
R_2 &= R_{tot} \cdot \frac{V_1 - V_2}{V_{in}} = 100k \cdot \frac{3.25-1.70}{5} = 31.0\,k\Omega \\
R_3 &= R_{tot} \cdot \frac{V_2 - V_3}{V_{in}} = 100k \cdot \frac{1.70-0.10}{5} = 32.0\,k\Omega \\
R_4 &= R_{tot} \cdot \frac{V_3}{V_{in}} = 100k \cdot \frac{0.10}{5} = 2.0\,k\Omega
\end{aligned}
$$

**Optimeeritud diskreetsed väärtused (minimaalne komponentide arv):**

Kasutades skripti `ladder-calc.js`:
```
R1: 100Ω + 220Ω + 4.7kΩ ≈ 5.02kΩ
R2: 4.7kΩ ≈ 4.70kΩ  
R3: 4.7kΩ ≈ 4.70kΩ
R4: 220Ω ≈ 0.22kΩ
```
Ennustatud sõlmpinged: V1=3.29V, V2=1.68V, V3=0.08V (viga ±3%)

### 5.2 Digiprojekt - LTspice simulatsioon

**Eesmärk ja loogika.** Digisisendi laienduse eesmärk on realiseerida loogikafunktsioon $\overline{A} + B$, kus `A` on mehaaniline lüliti (Active Low) ning `B` on tavaline digitaalne signaal (Active High). Praktikas võrreldi kahte varianti: diood-VÕI, kus `A` inverteeritakse enne OR-sõlme, ja RTL VÕI-EI, maketil testiti mõlemad.

**Skeemi alus ja komponentide valik** 

**Dioodi-lahenduses** pärast inverteerimist jõuab $\overline{A}$ koos $B$-ga diood-VÕI sõlme. Tüüpilised väärtused: `Rpull-up ≈ 1kΩ` (kui ainult lüliti on aktiivne, tagab ~3,9 V väljundi; 10kΩ puhul langeks ~2.1 V peale), `Rbase ≈ 47kΩ…100kΩ` (piirab baasi voolu, hoiab transistori küllastuses), dioodid 1N4148. Skeem on mõeldud kiireks kahe signaali liitmiseks minimaalsete komponentidega, näiteks Arduino Nano ise kasutab USB ja 5 V regulaatori ühendamiseks SS1P3L dioodi. Selline lahendus ei sobi kui täpsus väljundi stabiilsus on oluline. Selle skeemi kasvukiirus sõltub transistori sisemisest kondensaatorist, mis suure baasitakistiga jõuab lülitamiskiirus 10% - 90% mikrosekundite suurusjärku. TTL, võrdluseks, integralskeemid pakkuvad paremat lülitamiskiirust (~10 ns) ja suuremat fan-out’i, kuid antud ülesandes oli eesmärgiks luua skeemi käepärastest komponentidest ja võimalikult lihtsa skeemi. TTL loogika sisaldab mitme emitteriga sisend-transistori ja väljundis "totem-pole", mis suurendab transistorite arvu.

**Transistor-NOR lahenduses** kasutatakse kahte NPN transistori (2N3904) paralleelühenduses, mille kollektorid on ühendatud ühise koormustakisti sõlme `Rcollector ≈ 1kΩ…4.7kΩ`. Tüüpilised väärtused: `Rbase ≈ 10kΩ` (tagab piisava baasi voolu sisendist), `Rcollector ≈ 4.7kΩ` (määrab madaltaseme pinge ja voolu). Skeem realiseerib otse NOR-funktsiooni: kui vähemalt üks sisend on kõrgtasemel (ületab baas-emitteri pingelangu), on vastav transistor küllastuses ja tõmbab väljundi maasse ($V_{OL}\approx0.2\,\mathrm{V}$). Ainult kui mõlemad sisendid on madaltasemel, jääb väljund kõrgele ($V_{OH}\approx4.8\,\mathrm{V}$). RTL NOR-i eeliseks on väga lihtne ülesehitus ja poole kiirem lülitamiskiirus (~500 ns). RTL NOR sobib hästi kiire skeemi koostamiseks ja proovimiseks makettplaadis, kus ei ole vaja suurt sisendite arvu ega kiireid lülitumisi.

**Simulatsiooni seadistus (LTspice).**
- Toide 5 V, mudelid: 2N3904, 1N4148.
- Sisendid: PULSE-allikad erinevate perioodidega 
  (`PULSE(5 0 0 1u 1u 5m 15m)` ja `PULSE(0 5 0 1u 1u 10m 20m)`), 
  et katta kõik neli sisendkombinatsiooni.
- Väljund ilma koormuseta.

**Arvutuskäik ja eeldused.** 
Baasitakistid $R_B = 10\,\mathrm{k}\Omega$, inverteri ja väljundi 
pull-up $R_C = 4.7\,\mathrm{k}\Omega$. 
BJT tavanäitajad: $V_{BE} \approx 0.7\,\mathrm{V}$, 
$V_{CE(sat)} \approx 0.2\text{–}0.3\,\mathrm{V}$ (andmelehest) küllastuses.

Inverteri kollektori vool (küllastuses): 
$I_C \approx \frac{5-0.2}{4.7\,\mathrm{k}} \approx 1.0\,\mathrm{mA}$.

Küllastuse tagamiseks on vaja 
$I_B \gtrsim I_C/\beta_{sat} \approx 1.0\,\mathrm{mA}/10 \approx 0.1\,\mathrm{mA}$ 
(kus $\beta_{sat} \approx 10$).

Tegelik baasi vool $R_B = 10\,\mathrm{k}\Omega$ korral: 
$I_B \approx \frac{5-0.7}{10\,\mathrm{k}} \approx 0.43\,\mathrm{mA}$, 
mis **ületab** vajaliku miinimumi ~4x → tagab küllastuse ja 
kiire lülitumise.

Väljundtasemed: 
- $V_{OL} \approx 0.2\,\mathrm{V}$ (vähemalt üks transistor küllastuses). Andmelehe kohaselt on $V_{CE(sat)}$ tavaliselt 0.2 V juures $I_C = 1\,\mathrm{mA}$ ja $I_B = 0.1\,\mathrm{mA}$, simulatsioonis ja päris elus ei ületanud isegi 50 mV'ti.
- $V_{OH} \approx 5.0\,\mathrm{V}$ (mõlemad transistorid väljas, pull-up 
  läbi $R_C$)

Need ületavad Arduino Nano (ATmega328P) loogikatasemed 
($V_{IL} < 0.3V_{CC} = 1.5\,\mathrm{V}$, 
$V_{IH} > 0.6V_{CC} = 3.0\,\mathrm{V}$) korraliku varuga.

**Tulemused ja võrdlus reaalsega.**

Mõõtetulemused reaalse dioodi skeemiga. Lisaks mõõtsime väljundit ka Arduino analoog sisendiga, mis on resolutsiooniga 0-1023, seega 5 V / 1024 = 0,00488 V sammuga.

| Source      | inv. SW (V) | Digital (V) | OUT (Arduino) | OUT (Multimeter) | OUT (V) |
|------------|-------------|-------------|---------------|----------------|---------|
| Real       | 0,92       | -0,2        | 0,64          | 0,43           |         |
| Real       | 0,92       | 4,8         | 4,4           | 4,03           |         |
| Real       | 4,77       | -0,01       | 4,36          | 4,19           |         |
| Real       | 4,80       | 4,8         | 4,4           | 4,26           |         |
| LTSpice    | 0,677      | 0           |               |                | 0,259   |
| LTSpice    | 0,68       | 5           |               |                | 4,45    |
| LTSpice    | 4,77       | 0           |               |                | 4,22    |
| LTSpice    | 4,81       | 5           |               |                | 4,45    |


Mõõtetulemused NPN VÕI-EI skeemiga.

| inverteeritud SW (V) | Arduino digiväljund (V) | Allikas | Arduino analoogsisend (V) | Multimeeter (V) | LTSpice (V) |
|-------|-------|---------|-----------|-----------|-----------|
| 0.05  | 0     | Real    | 5.00      | 4.77      | 5.00      |
| 0.05  | 5     | Real    | 0.03      | 0.02      | 0.00      |
| 3.49  | 0     | Real    | 0.03      | 0.03      | 0.00      |
| 3.49  | 5     | Real    | 0.02      | 0.02      | 0.00      |
| 0.05  | 0     | LTSpice | 5.00      | 5.00      | 5.00      |
| 0.05  | 5     | LTSpice | 0.00      | 0.00      | 0.00      |
| 3.49  | 0     | LTSpice | 0.00      | 0.00      | 0.00      |
| 3.49  | 5     | LTSpice | 0.00      | 0.00      | 0.00      |

Simulatsiooni ja reaalsete mõõtmiste võrdlus näitab head ühtivust. Multimeetri pingemõõtmistes esines ~0,23 V süstemaatiline hälve võrreldes Arduino analoogsisendi mõõtmistega. Sama hälve ilmnes ka dioodi skeemi mõõtmisel, mis viitab multimeetri heale kordustäpsusele, kuid 
millestki tingitud täpsusprobleemile. Madaltasemel on reaalsed väärtused 0,02–0,03 V, mis vastavad transistori küllastuspiirkonnale. Kõikidel juhtudel jäävad tasemed Arduino Nano loogikalävede suhtes ohutusse vahemikku.

**RTL vs TTL:** TTL (74LS02) pakub väiksemat sisetakistust, kiiremat lülitumist (~10 ns vs ~1 µs) ja paremat fan-out'i (~10 vs ~5). Antud ülesande korral on RTL lahendus piisav ning praktilisem, kuna diskreetsed komponendid (transistorid, takistid) on hobikorras saadavamad kui spetsiifilised loogika integralskeemid. Kui nõuded kasvavad (pikad juhtmed, tugev EMI, kiire lülitumine, suurem koormus), oleks mõistlikum liikuda TTL/CMOS integralskeemide peale või lisada Schmitt-triggeri puhver signaali järsustamiseks ja müravastupidavuse parandamiseks.


**Järeldus.** Simulatsioon kinnitab valitud RTL VÕI-EI lahenduse korrektsust: loogikatasemed kattuvad, väljundtasemed vastavad Arduino sisendnõuetele ning edukalt loevad loogilist taset.

---

## 6. Makettplaadil testimine

### 6.1 Analoogprojekt

**Testimise protokoll (28.09.2025):**

- Uko + Karl: ~30 min makettplaadi koostamine
- 2-3h brute-force takistuste testimine LED-väljundite saavutamiseks

**Mõõtetulemused:**

- 300 lx juures: V(out) ≈ 1.7V ✓
- 500 lx juures: V(out) ≈ 3.25V ✓
- LED-id lülituvad õigesti vastavalt läviväärtustele

**Mõõtetäpsus:** ±10% võrreldes valgusmõõtjaga (nõue täidetud)

### 6.2 Digiprojekt

Testitud dioodidega OR-värav + NPN inverter kombinatsiooni. Väljundpinged langevad kokku simulatsiooniga ~5% täpsusega.

---

## 7. Toiteallikas

### 7.1 Probleemipüstitus

LM324 op-amp **ei ole rail-to-rail**, kaotab ~1.5V positiivsest toitest. 3.3V toite korral max väljund ~1.8V - ei piisa 3V LED-ide juhtimiseks.

**Lahendus:** 9V Li-Ion aku → 5V lineaarregulaator (L7805)

### 7.2 Kaitseskeemid

1. **PTC kaitse (RXEF010):** 100mA hold, 200mA trip - lühise kaitse
2. **P-MOSFET (AO3401A):** pöördpolaarsuse kaitse, kadudeta lahendus
3. **TVS diood (SMBJ9.0A):** ESD ja ülepinge kaitse

### 7.3 Efektiivsus

- Sisend: 8.4V × 50mA = 420mW
- Väljund: 5.0V × 50mA = 250mW
- Kasutegur: ~60%

---

## 8. KiCad elektriskeem

### 8.1 Skeemi kirjeldus

Elektriskeem koostati KiCadis, sisaldab:
- LM324 op-amp (4 kanalit)
- BPW34 fotodiood
- Takistiredel referentspingeteks
- 3 LED-i väljundina
- L7805 pingeregulaator koos kaitseskeemidega
- Barrel jack sisendpistik

### 8.2 Erinevused simulatsioonist

| Aspekt | LTspice | KiCad |
|--------|---------|-------|
| Toide | Ideaalne 5V | 9V→5V regulaator |
| Kaitsed | Puuduvad | PTC, MOSFET, TVS |
| Pistikud | Puuduvad | Barrel jack, pin headers |

### 8.3 Komponentide valiku kriteeriumid

- **Saadavus:** eelistatud kohvris olevad komponendid
- **Jootmise võimekus:** THT komponendid, v.a. mõned SMD
- **Hind:** minimaalne, kasutades olemasolevaid

---

## 9. KiCad trükkplaat

### 9.1 Disainimetoodika

- **Raja laius:** 0.5mm signaalrajad, 1mm toiterajad
- **Läbiviigud:** 0.5mm auk / 0.8mm pad
- **Komponentide paigutus:** sisend vasakul, väljund paremal, toide üleval

### 9.2 Tähelepanu pööratud

- Kondensaatorid regulaatori lähedal
- Lühikesed rajad op-ampi sisendites (müra vähendamine)
- Maandustasand müra vähendamiseks

### 9.3 Enim aega võttis

- Komponentide optimaalne paigutus kompaktsuse saavutamiseks
- Radade ruutimine ilma läbiviiukideta (single-layer)

### 9.4 Tootmine

- **Tootja:** JLCPCB
- **Võimekus:** min 0.3mm rajad, 0.45mm läbiviigud
- **Plaadi suurus:** optimeeritud 5×5cm

---

## 10. Komponentide maksumus (BOM)

### 10.1 Analoogprojekt — BOM

Komponentide nimekiri on eksporditud KiCadist (`analog/kicad/scheme.csv`).

| Nimetus PCB-l | Kogus | Väärtus | Footprint | Andmeleht | Hind (€) |
|---------------|-------|---------|-----------|-----------|----------|
| BT1 | 1 | 9V patareipesa | Battery Holder | [Link](https://www.mouser.com/catalog/specsheets/EPD-200766.pdf) | 1.46 |
| C1 | 1 | 22pF | 0805 SMD | [Link](https://mm.digikey.com/Volume0/opasdata/d220001/medias/docus/5534/CL21C220JB61PNC%20Spec.pdf) | 0.10 |
| C2 | 1 | 1µF | 0805 SMD | [Link](https://mm.digikey.com/Volume0/opasdata/d220001/medias/docus/5660/3372_0805B105J250CC.pdf) | 0.10 |
| C3, C4 | 2 | 10µF | 0805 SMD | [Link](https://mm.digikey.com/Volume0/opasdata/d220001/medias/docus/5660/3372_0805W106K6R3CC.pdf) | 0.32 |
| C5 | 1 | 100nF | 0805 SMD | [Link](https://mm.digikey.com/Volume0/opasdata/d220001/medias/docus/5491/0805B104K201DC.pdf) | 0.06 |
| D1 | 1 | BPW34 fotodiood | THT DIL2 | [Link](http://www.vishay.com/docs/81521/bpw34.pdf) | 1.06 |
| D2, D3, D4 | 3 | LED 5mm | THT horisontaalne | - | 0.30 |
| D5 | 1 | LED (power) | 0805 SMD | - | 0.05 |
| D6 | 1 | SMAJ13A TVS | SMA SMD | [Link](https://www.littelfuse.com/media?resourcetype=datasheets&itemid=75e32973-b177-4ee3-a0ff-cedaf1abdb93&filename=smaj-datasheet) | 0.12 |
| F1 | 1 | PTC kaitse 50mA | 1206 SMD | [Link](https://www.mouser.ee/datasheet/3/508/1/smdh1206.pdf) | 0.09 |
| R1 | 1 | 220Ω | 0805 SMD | - | 0.02 |
| R2 | 1 | 500kΩ | 0805 SMD | - | 0.02 |
| R3, R6 | 2 | 10kΩ | 0805 SMD | - | 0.04 |
| R4 | 1 | 14.7kΩ | 0805 SMD | - | 0.02 |
| R5 | 1 | 5kΩ | 0805 SMD | - | 0.02 |
| R7-R10 | 4 | 1kΩ | 0805 SMD | - | 0.08 |
| SW1 | 1 | Nidec CAS-120A lüliti | SMD | [Link](https://www.nidec-components.com/e/catalog/switch/cas.pdf) | 1.26 |
| U1 | 1 | LM7805 regulaator | TO-220 THT | [Link](https://www.onsemi.cn/PowerSolutions/document/MC7800-D.PDF) | 1.55 |
| U2 | 1 | LM324 op-amp | DIP-14 THT | [Link](http://www.ti.com/lit/ds/symlink/lm2902-n.pdf) | 0.40 |
| **Komponendid kokku** | | | | | **~7.07** |

#### 10.1.1 Trükkplaadi tootmine (PCBWay)

| Teenus | Kirjeldus | Hind (€) |
|--------|-----------|----------|
| PCB tootmine | 2-kihiline, 1.6mm FR4, HASL, 5 tk min | **5.00** |
| Transport | Eestisse (DHL/ePacket) | ~8-15 |
| **PCB kokku** | | **~5.00** (+ transport) |

#### 10.1.2 PCBA teenus (SMD komponentide eelpaigaldus)

PCBWay pakub ka **PCBA (PCB Assembly)** teenust, kus tehases joodetatakse SMD komponendid otse plaadile. See on kasulik väikeste 0805 takistite ja kondensaatorite puhul, mille käsitsi jootmine on aeganõudev.

**Eelpaigaldamiseks sobivad komponendid (0805 SMD):**

| Nimetus | Kogus | Väärtus | LCSC kood (näide) |
|---------|-------|---------|-------------------|
| C1 | 1 | 22pF | C1804 |
| C2 | 1 | 1µF | C28323 |
| C3, C4 | 2 | 10µF | C15850 |
| C5 | 1 | 100nF | C49678 |
| D5 | 1 | LED 0805 | C2296 |
| D6 | 1 | SMAJ13A | C148892 |
| F1 | 1 | PTC 1206 | C262826 |
| R1-R10 | 10 | Takistid 0805 | C17513, C17414, jne |
| SW1 | 1 | Nidec lüliti | - (käsitsi) |

**PCBA hinnakalkulatsioon (PCBWay):**

| Kulu | Hind (€) |
|------|----------|
| Seadistustasu (setup fee) | ~8.00 |
| Jootmistasu (per joint, ~40 jootekoha) | ~2.00 |
| SMD komponentide hind (LCSC) | ~1.50 |
| **PCBA kokku (5 plaati)** | **~12-15** |
| **PCBA ühe plaadi kohta** | **~2.50-3.00** |

#### 10.1.3 Kokkuvõte - Kolm varianti

| Variant | Kirjeldus | Hind ühe komplekti kohta |
|---------|-----------|--------------------------|
| **A) Ainult PCB** | Tühi plaat, kõik käsitsi jootmine | PCB: 1€ + komponendid: 7€ = **~8€** |
| **B) PCB + PCBA (SMD)** | SMD eelpaigaldatud, THT käsitsi | PCB+PCBA: 4€ + THT komponendid: 5€ = **~9€** |
| **C) Täis PCBA** | Kõik komponendid tehases paigaldatud | ~15-20€ (väikese koguse tõttu kallis) |

**Soovitus:** Variant B on optimaalne - SMD komponendid (takistid, kondensaatorid, TVS, PTC) paigaldatakse tehases, THT komponendid (LM324, LM7805, LED-id, fotodiood, patareipesa) joota ise.


#### 10.2 Digiprojekt — BOM

Komponentide nimekiri KiCadi skeemist (`digital/kicad/digital_kicad.kicad_sch`).

| Nimetus PCB-l | Kogus | Väärtus | Footprint | Hind (€) |
|---------------|-------|---------|-----------|----------|
| A1 | 1 | Arduino Nano Socket | THT pistikupesa 2×15 pin | 0.50 |
| - | 1 | Arduino Nano (ATmega328P) | – | ~5€ (kloon) / ~27€ (originaal) |
| J1 | 1 | Barrel Jack | THT | 0.30 |
| J2 | 1 | Screw Terminal 2-pin | THT | 0.20 |
| F1 | 1 | Polyfuse PTC | SMD/THT | 0.10 |
| Q1, Q2 | 2 | 2N3904 NPN | TO-92 THT | 0.10 |
| Q3 | 1 | FDN340P P-MOSFET | SOT-23 SMD | 0.15 |
| R2, R3, R4 | 3 | 10kΩ | 0805 SMD | 0.06 |
| R5, R6 | 2 | 4.7kΩ | 0805 SMD | 0.04 |
| R1 | 1 | 1kΩ | 0805 SMD | 0.02 |
| R7 | 1 | 33kΩ | 0805 SMD | 0.02 |
| C2 | 1 | 100nF | 0805 SMD | 0.02 |
| C1, C4 | 2 | 1µF | 0805 SMD | 0.10 |
| D1 | 1 | TVS (ESD/Zener) | SMD | 0.10 |
| D3 | 1 | LED indikaator | THT 5mm | 0.05 |
| SW1 | 1 | Nidec CAS-120A lüliti | SMD | 1.26 |
| SW2 | 1 | SPST lüliti (mehaaniline) | THT | 0.20 |
| **Komponendid (ilma Arduinota)** | | | | **~3.22** |
| **Komponendid + Arduino (kloon)** | | | | **~8.22** |
| **Komponendid + Arduino (originaal)** | | | | **~30.22** |

#### 10.2.1 Digiprojekti PCB tootmine

| Teenus | Kirjeldus | Hind (€) |
|--------|-----------|----------|
| PCB tootmine (PCBWay) | 2-kihiline, 5 tk | ~5.00 |
| Transport | Eestisse | ~8-15 |

**Märkus:** Digiprojekti PCB ja passiivsed komponendid on odavad (~3€), kuid Arduino Nano on projekti kalleim osa. Hiina klooniga (AliExpress, ~5€) jääb kogumaksumus madalaks, originaal Arduino Nano (Arduino Store, ~27€) tõstab hinna oluliselt. Projekti jaoks sobib kloon, kuna ATmega328P funktsionaalsus on identne.

---

## 11. Projekti ajakava

### 11.1 Esialgne vs tegelik

| Nädal | Planeeritud | Tegelik |
|-------|-------------|---------|
| 4 | Projekti valik, esialgsed ideed | ✓ Tehtud |
| 5-6 | Simulatsioon | ✓ LTspice skeemid valmis |
| 7-8 | Makettplaat | ✓ Testitud, takistused leitud |
| 9-10 | KiCad skeem + PCB | ✓ Skeem ja PCB valmis |
| 11-12 | Viimistlus, aruanne | ✓ Käesolev dokument |

### 11.2 Projekti ajalugu (Git commits)

```
2025-09-24: Initial commit, first ideas
2025-09-25: Arduino digital input extension documentation
2025-09-28: Resistance calculations, LLM-generated formulas
2025-10-04: More schematics and images
2025-10-15: Diode simulation and real measurements
2025-10-25: KiCad project setup
2025-11-03: KiCad schematic and PCB - initial
2025-11-10: PCB routing, 9V→5V schematic
2025-11-16: Added ESD and reverse polarity protection
2025-11-17: PCB cleanup, power LED
2025-11-18: Updated PCB with Jarek's changes
2025-11-26: More AI research + KiCad schematic update
2025-11-28: Added fuse + TVS protection
```

---

## 12. Projekti osalejate panus

### 12.1 Uko

**Tehtud tööd:**
- Analoogprojekti kontseptsioon ja simulatsioon LTspice'is
- Takistiredeli matemaatilised arvutused
- Node.js skripti loomine takistuste optimeerimiseks
- Makettplaadil testimine (koos Karliga)
- Dokumentatsiooni koostamine

**Mis läks hästi:**
- Simulatsioon andis täpsed tulemused, mis ühtisid reaalsusega
- Automatiseeritud skript säästis aega takistuste valimisel

**Mis läks halvasti:**
- Esialgne ajakava oli liiga optimistlik
- LM324 rail-to-rail piirangut ei arvestatud alguses

**Mida nüüd oskan paremini:**
- Op-ampide karakteristikute arvestamine juba projekti alguses
- Süstemaatiline lähenemine takistuste valikule

### 12.2 Jüri

**Tehtud tööd:**
- Digiprojekti kontseptsioon ja loogika analüüs
- Transistoritega skeemide simuleerimine
- KiCad skeemi ja PCB koostamine
- Toiteallika disain koos kaitseskeemidega

**Mis läks hästi:**
- Digiprojekti loogika oli selge ja lihtne realiseerida
- Toiteallika kaitsed töötasid ootuspäraselt

**Mis läks halvasti:**
- PCB ruutimine võttis oodatust kauem
- Mõned komponendi footprint'id tuli käsitsi parandada

**Mida nüüd oskan paremini:**
- KiCadi footprint'ide kontroll enne PCB tellimist
- Kaitseskeemide integreerimine juba projekti alguses

### 12.3 Karl

**Tehtud tööd:**
- Esialgsete takistite valik ja takistiredeli analüüs ning selle testimine makettplaadil
- KiCadi skeemiga aitasin ja PCB koostamine
- Makettplaadil testimine (koos Ukoga)
- BoM-i koostamine: hinnavõrdlused ja sobivate alternatiivide leidmine puuduvate või kallimate komponentide korral

**Mis läks hästi:**
- Reaalsed mõõtetulemused kattusid simulatsioonidega
- PCB koostamine
- BoM-i koostamine ja komponentide valik

**Mis läks halvasti:**
- Üldine ajaplaneerimine oli nõrk: mitmed ülesanded lükkusid edasi
- Oleks pidanud sagedamini juhendajaga konsulteerima, mis oleks aidanud mõningaid tehnilisi takistusi varem ennetada

**Mida nüüd oskan paremini:**
- PCB disaini töövoog KiCadis
- Hinnata erinevate komponentide praktilist sobivust (SMD vs THT) vastavalt projekti keerukusele ja töömahtudele
- Planeerida aega realistlikumalt ning kaasata juhendaja tagasisidet enne suuremate disainimuudatuste tegemist

### 12.4 Jarek

**Tehtud tööd:**
- Projekti lahenduskäikude uurimine ja vajalike komponentide kontrollimine
- Makettplaadil transistor- ja dioodlahenduse koostamine ning tulemuste mõõtmine multimeetri ja Arduino analoog sisendiga
- KiCad’is trükkplaadi disainimine
- BoM koostamine vastavalt KiCad skeemile

**Mis läks hästi:**
- Makettplaadil mõõdetud tulemused langesid kokku simulatsiooniga
- Projekti käigus sain uusi kogemusi ja teadmisi

**Mis läks halvasti:**
- Algselt ei olnud trükkplaadil rajade ruutimine korrektne ning rajad oleks võinud laiemad olla
- Oleks pidanud KiCad skeemi koostamisse rohkem panustama

**Mida nüüd oskan paremini:**
- Enne skeemi kokkupanemist makettplaadile oli kasulik kasutada Tinkercad’i simulaatorit, et kontrollida, kas väljundid on ootuspärased
- Parem arusaamine trükkplaadi koostamisest: komponentide paigutamisest, rajade ruutimisest ja maakihi kasutamisest


---

## 13. Kokkuvõte

Mõlemad projektid viidi edukalt lõpule. Analoogprojekt demonstreerib fotodioodiga valgustugevuse mõõtmist ja komparaatoritega tasemete määramist ±10% täpsusega. Digiprojekt näitab, kuidas Arduino sisendeid saab laiendada diskreetsete komponentidega.

Peamised õppetunnid:
1. Simulatsioon on hädavajalik enne makettplaadile minekut
2. Komponentide piiranguid tuleb arvestada juba projekti alguses
3. Dokumentatsioon ja versioonihaldus (Git) säästab aega

---

## Viited

1. MCP6002 datasheet: https://www.alldatasheet.com/html-pdf/195202/MICROCHIP/MCP6002
2. LM324N datasheet: https://www.alldatasheet.com/html-pdf/17880/PHILIPS/LM324N
3. BPW34 datasheet: https://www.alldatasheet.com/html-pdf/26251/VISHAY/BPW34
4. Transistor OR gates: http://hyperphysics.phy-astr.gsu.edu/hbase/Electronic/trangate.html
5. Debouncing guide: https://my.eng.utah.edu/%7Ecs5780/debouncing.pdf
6. 9V to 5V converter: https://somanytech.com/9v-to-5v-converter-circuit/
7. [rtl-source]: https://eee.poriyaan.in/topic/resistor---transistor-logic--rtl--11599/
8. [ttl-source]: https://eee.poriyaan.in/topic/transistor-transistor-logic--ttl--11601/
9. reverse-leakage-current https://en.wikipedia.org/wiki/Reverse_leakage_current

---

## Lisad

- Lisa 1: LTspice simulatsioonifailid (`analog/LTspice/`)
- Lisa 2: KiCad projektifailid (`analog/kicad/`)
- Lisa 3: Takistuste arvutusskript (`analog/llm-slop/ladder-calc.js`)
- Lisa 4: Mõõtmiste tabel (`analog/Mõõtmised.xlsx`)
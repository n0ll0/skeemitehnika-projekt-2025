# IEE1030 Skeemitehnika Lõpparuanne

**Projektid:**
- Arduino Nano digisisendi laiendus
- Valgustugevuse mõõtmine fotodioodiga

**Autorid:** Uko, Jüri

**Juhendajad:** Kaiser Pärnamets, Andres Eek

**Tallinna Tehnikaülikool, 2025**

---

## 1. Sissejuhatus

Käesolev aruanne kirjeldab kahe skeemitehnika projekti läbiviimist IEE1030 aine raames. Esimene projekt keskendub Arduino Nano digitaalse sisendi laiendamisele analoogkomponentidega, teine projekt valgustugevuse mõõtmisele fotodioodiga vahemikus 300–500 luksi.

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
| Takistid: 100Ω, 220Ω, 1kΩ, 4.7kΩ, 10kΩ, 47kΩ, 100kΩ, 1MΩ | 5–20 tk |
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

---

## 3. Projekti valik ja motivatsioon

### 3.1 Projekt 1: Arduino Nano digisisendi laiendus

**Püstitus:** Luua skeem, mille sisendiks on 2 digitaalset signaali:
1. Mehaaniline kontakt (Active Low)
2. Digitaalne signaal (Active High)

Skeem peab käituma kui OR-värav, arvestades inverteeritud sisendiga.

**Motivatsioon:** Soov õppida loogikaväravate realiseerimist diskreetsete komponentidega ning mõista, kuidas Arduino sisendeid saab laiendada ilma täiendavate mikrokontrolleriteta.

### 3.2 Projekt 2: Valgustugevuse mõõtmine fotodioodiga

**Püstitus:** Koostada skeem, mis hindab valgustatust vahemikus 300–500 luksi, kasutades kolme LED-i:
- Punane: valgustatus alla 300 lx
- Kollane: valgustatus 300–500 lx
- Roheline: valgustatus üle 500 lx

**Motivatsioon:** Praktiline rakendus valgustingimuste hindamiseks, kasutades ainult analoogkomponente (Arduino välistatud).

### 3.3 Uuritud lahendused

#### Analoogprojekt – kolm lahendust:

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

#### Digiprojekt – kolm lahendust:

1. **Dioodidega OR-värav + transistorinverter**
   - Lihtne, vähe komponente
   - *Miinus:* dioodi pingelang vähendab väljundit

2. **Transistoritega NOR/OR**
   - Väljund otse toitega ühendatud (NOR)
   - *Valitud testimiseks*

3. **Ainult IC-dega (74LS02 NOR / 74LS00 NAND)**
   - Puhas digitaallahendus
   - *Alternatiiv*

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

### 5.1 Analoogprojekt – LTspice simulatsioon

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

Pingeredeli valemid (R1–R4 jadaühenduses, Vin=5V):

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

### 5.2 Digiprojekt – LTspice simulatsioon

**Tõeväärtustabel:**

| A (lüliti) | B (signaal) | Väljund |
|------------|-------------|---------|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**Minimaalne DNF:** A' + B

**Simulatsiooni tulemused vs tegelikkus:**

| Allikas | inv. SW (V) | Digital (V) | OUT (V) |
|---------|-------------|-------------|---------|
| LTSpice | 0.68 | 0 | 0.26 |
| LTSpice | 0.68 | 5 | 4.45 |
| LTSpice | 4.77 | 0 | 4.22 |
| LTSpice | 4.81 | 5 | 4.45 |
| Reaalne | 0.92 | -0.2 | 0.43 |
| Reaalne | 0.92 | 4.8 | 4.03 |
| Reaalne | 4.77 | -0.01 | 4.19 |
| Reaalne | 4.80 | 4.8 | 4.26 |

---

## 6. Makettplaadil testimine

### 6.1 Analoogprojekt

**Testimise protokoll (28.09.2025):**
- Uko + Karl: ~30 min makettplaadi koostamine
- 2–3h brute-force takistuste testimine LED-väljundite saavutamiseks

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

LM324 op-amp **ei ole rail-to-rail**, kaotab ~1.5V positiivsest toitest. 3.3V toite korral max väljund ~1.8V – ei piisa 3V LED-ide juhtimiseks.

**Lahendus:** 9V Li-Ion aku → 5V lineaarregulaator (L7805)

### 7.2 Kaitseskeemid

1. **PTC kaitse (RXEF010):** 100mA hold, 200mA trip – lühise kaitse
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

### 10.1 Analoogprojekt

| Tootja | Tootja kood | Kogus | Nimetus PCB-l | Edasimüüja | Hind (€) |
|--------|-------------|-------|---------------|------------|----------|
| Texas Instruments | LM324N | 1 | U1 | Mouser | 0.45 |
| Vishay | BPW34 | 1 | D1 | Mouser | 1.20 |
| ST | L7805CV | 1 | U2 | Mouser | 0.35 |
| Generic | 1/4W resistors | ~15 | R1-R15 | Mouser | 0.50 |
| Generic | LED 5mm | 3 | LED1-3 | Mouser | 0.30 |
| Generic | Caps 100nF, 10µF | 5 | C1-C5 | Mouser | 0.40 |
| Alpha | RXEF010 | 1 | F1 | Mouser | 0.25 |
| AOS | AO3401A | 1 | Q1 | Mouser | 0.15 |
| Littelfuse | SMBJ9.0A | 1 | D2 | Mouser | 0.30 |
| - | PCB (JLCPCB) | 1 | - | JLCPCB | 2.00 |
| **KOKKU** | | | | | **~6.00** |

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

---

## Lisad

- Lisa 1: LTspice simulatsioonifailid (`analog/LTspice/`)
- Lisa 2: KiCad projektifailid (`analog/kicad/`)
- Lisa 3: Takistuste arvutusskript (`analog/llm-slop/ladder-calc.js`)
- Lisa 4: Mõõtmiste tabel (`analog/Mõõtmised.xlsx`)
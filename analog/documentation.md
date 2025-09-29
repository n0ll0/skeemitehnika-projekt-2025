# Analog project docs

Koostada skeem, mis hindab valgustatust vahemikus 300-500 luksi ja kasutades selleks kolme LED-i:

- valgustatus on alla 300 luksi,
- valgustatus on vahemikus 300-500 luksi
- ja valgustatus on üle 500 luksi.

Lahenduses kasutada analoogkomponente (st Arduino Nano jääb valikust välja).

valgustatuse mõõtmine, kohvris oleva fotodioodi sobivus selleks

muundur: fotodioodi vool -> pinge

valgustatuse näidu tasemete määramine (komparaator ehk comparator)

täpsus võiks jääda +-10% suurusjärku võrreldes valgusmõõtjaga

## Initial scheme ideas

### Idea 1 (juri's)

MCP6002 has 2 opamps

- 1 for the current to convert to voltage
- other can be used for comparator

### Idea 2

![I was thinking of this, just without the encoder](./voltage-to-LED-array.png)
[voltage to LED array](https://www.electronics-tutorials.ws/combination/analogue-to-digital-converter.html)

### LTspice schema of conjoined ideas

[Valgustugevuse mõõtmine fotodioodiga](./analog-scheme.asc)
![Valgustugevuse mõõtmine fotodioodiga](./analog-scheme.png)

## Protokoll 09:25

Uko + Karl:
spent 30min on making the breadboard implementation, then 2-3h on brute force guessing/testing different resistances to achieve correct led outputs on specified luxes.

## Manually get LUX -> Voltage at 500kO

Plottisin ja arduino plotterilt/monitorilt lugesin pinge väärtuseid V(out) sõlmes

| lux | V    |
|-----|------|
| 300 | 1.7  |
| 500 | 3.25 |

### Finding R*esistance* values

Here we also see if our inventory can get us these answers.

```sh
node ./llm-slop/ladder-calc.js --vin 5 --v1 3.25 --v2 1.7 --v3 0.1 --rtot 100000 --tol 0.01 --max-series 5 --inventory
```

```terminal
analog\llm-slop> node ./ladder-calc.js --vin 5 --v1 3.25 --v2 1.7 --v3 0.1 --rtot 100000 --tol 0.01 --max-series 5 --inventory
Inputs:
  Vin=5 V, targets: V1=3.25 V, V2=1.7 V, V3=0.1 V
  Total S=100000 Ω, divider current ≈ 50.00 µA
Exact resistor values (from formulas):
  R1=35000.00 Ω, R2=31000.00 Ω, R3=32000.00 Ω, R4=2000.00 Ω
  Predicted nodes with exact R: V1=3.250 V, V2=1.700 V, V3=0.100 V

Searching discrete combinations (tol=±1.00%, max 5 in series per leg) …
  R4: 2×1 kΩ ≈ 2000.00 Ω (err 0.00 Ω, parts 2)
  R3: 2×1 kΩ + 3×10 kΩ ≈ 32000.00 Ω (err 0.00 Ω, parts 5)
  R2: 1×1 kΩ + 3×10 kΩ ≈ 31000.00 Ω (err 0.00 Ω, parts 4)
  R1: 1×220 Ω + 1×4.700 kΩ + 3×10 kΩ ≈ 34920.00 Ω (err 80.00 Ω, parts 5)

Predicted nodes with discrete picks:
  V1=3.253 V, V2=1.701 V, V3=0.100 V; current ≈ 50.04 µA
```

### Version, with brute-force finding the least amount of resistors

(trying rtot and v3)

```terminal
node ./llm-slop/ladder-calc.js --vin 5 --v1 3.25 --v2 1.7 --v3 0.05 --rtot 50000 --tol 0.1 --max-series 5 --inventory
...
---
Best result found by varying total resistance:
  Total S=14400 Ω, total parts used: 6
  R4: 1×220 Ω ≈ 220.00 Ω (err 9.76 Ω, parts 1)
  R3: 1×4.700 kΩ ≈ 4700.00 Ω (err 14.24 Ω, parts 1)
  R2: 1×4.700 kΩ ≈ 4700.00 Ω (err 236.00 Ω, parts 1)
  R1: 1×100 Ω + 1×220 Ω + 1×4.700 kΩ ≈ 5020.00 Ω (err 20.00 Ω, parts 3)
  Predicted nodes: V1=3.286 V, V2=1.680 V, V3=0.075 V; current ≈ 341.53 µA
Inputs:
  Vin=5 V, targets: V1=3.25 V, V2=1.7 V, V3=0.10000000000000007 V
  Total S=50000 Ω, divider current ≈ 100.00 µA
Exact resistor values (from formulas):
  R1=17500.00 Ω, R2=15500.00 Ω, R3=16500.00 Ω, R4=500.00 Ω
  Predicted nodes with exact R: V1=3.250 V, V2=1.700 V, V3=0.050 V
...
```

[script to brute force the resistances](./llm-slop/ladder-calc.js)

[LLM generated formulas](./llm-slop/gen-formulas.md)

NOTE! I can smell a differential equasion here...

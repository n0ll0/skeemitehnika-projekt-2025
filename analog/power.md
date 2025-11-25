# Power Solution: 9V Li-Ion Battery → 5V Regulated Supply

## Overview

This document describes a complete power solution for the analog light measurement schematic. The design takes a **9V Lithium-Ion rechargeable battery** as input and produces a **stable 5V DC output** with comprehensive protection against:

- ⚡ **Reverse Polarity** (battery inserted backwards)
- 🔌 **Electrostatic Discharge (ESD)** (static electricity spikes)
- 🔥 **Overcurrent / Short Circuit** (accidental shorts)
- ⚠️ **Overvoltage Transients** (voltage spikes)

The circuit is designed to power our LM324 quad op-amp, BPW34 photodiode, and 3 indicator LEDs with a total current draw of approximately **50-100mA**.

---

## Why 9V Li-Ion + 5V Regulation?

### The LM324 Op-Amp Problem

The LM324 is **NOT a rail-to-rail output op-amp**. It loses approximately 1.5V from the positive supply rail internally.

| Supply Voltage | Maximum Output Voltage | Can Drive 3V LEDs? |
|----------------|------------------------|---------------------|
| 3.0V           | ~1.5V                  | ❌ NO              |
| 3.3V           | ~1.8V                  | ❌ NO              |
| 5.0V           | ~3.5V                  | ✅ YES             |

**Conclusion:** We need **5V supply** for reliable LED driving and proper op-amp operation.

### Why Li-Ion Rechargeable?

| Battery Type        | Nominal Voltage | Capacity  | Rechargeable | Notes                          |
|---------------------|-----------------|-----------|--------------|--------------------------------|
| Alkaline 9V (PP3)   | 9.0V → 6.5V     | ~550mAh   | ❌ No        | Voltage sags under load        |
| Li-Ion 9V           | 8.4V → 7.4V     | ~620mAh   | ✅ Yes       | Stable voltage, rechargeable   |
| Li-Poly 9V          | 8.4V → 7.4V     | ~520mAh   | ✅ Yes       | Stable voltage, rechargeable   |

**Recommendation:** Use a **9V Li-Ion rechargeable battery** (e.g., EBL, Hixon, or PALO brand) for:
- Consistent voltage output
- Better capacity than alkaline
- Environmentally friendly (reusable)
- Typical specs: 7.4V nominal, 8.4V fully charged

---

## Block Diagram

```
┌─────────────┐    ┌─────────┐    ┌─────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐
│  9V Li-Ion  │───▶│   PTC   │───▶│ MOSFET  │───▶│    TVS    │───▶│  L7805  │───▶│  FILTER  │───▶ 5V OUT
│   Battery   │    │  FUSE   │    │ REVERSE │    │   DIODE   │    │ LINEAR  │    │   CAPS   │
│  (7.4-8.4V) │    │ (100mA) │    │ PROTECT │    │  (ESD)    │    │   REG   │    │          │
└─────────────┘    └─────────┘    └─────────┘    └───────────┘    └─────────┘    └──────────┘
       │                                                                │
       │                                                                │
       └──────────────────── DGND (Common Ground) ──────────────────────┘
```

---

## Protection Stage Components

### 1. PTC Resettable Fuse (Overcurrent Protection)

**Component:** RXEF010 or similar PTC Polyfuse

| Parameter        | Value       |
|------------------|-------------|
| Hold Current     | 100mA       |
| Trip Current     | 200mA       |
| Max Voltage      | 30V         |
| Package          | Radial      |

**Function:** If a short circuit occurs, the fuse heats up and increases its resistance dramatically (from milliohms to kiloohms), effectively cutting power. When the fault is removed and the fuse cools, it resets automatically.

**Why not a regular fuse?** Regular fuses are one-time-use. PTC fuses are resettable, making them ideal for prototyping and development.

---

### 2. P-Channel MOSFET (Reverse Polarity Protection)

**Component:** AO3401A (SOT-23 package) or SI2301CDS

| Parameter              | AO3401A Value |
|------------------------|---------------|
| Drain-Source Voltage   | -30V          |
| Continuous Drain Current | -4A         |
| Gate Threshold Voltage | -0.6V to -1.4V |
| RDS(on) @ VGS=-4.5V    | 44mΩ          |
| Package                | SOT-23        |

**Wiring Configuration (High-Side Switch):**

```
                    ┌───────────────────────────────────────────────┐
                    │                                               │
   Battery (+) ─────┤ SOURCE (S)                                    │
                    │     │                                         │
                    │     └──────────────────── To Rest of Circuit  │
                    │                           (Regulator Input)   │
                    │                                               │
   Battery (-) ─────┤ GATE (G) ◄──────────────── Ground            │
    (Ground)        │                                               │
                    │ DRAIN (D) ◄──────────────── Output            │
                    └───────────────────────────────────────────────┘
```

**How It Works:**

| Battery Polarity | VGS (Gate-Source) | MOSFET State | Current Flow |
|------------------|-------------------|--------------|--------------|
| Correct (+/-)    | Negative (< -1V)  | ON (Conducting) | ✅ Current flows |
| Reversed (-/+)   | Positive (> 0V)   | OFF (Blocking)  | ❌ No current |

**Why not use a simple diode?**

| Method              | Voltage Drop | Power Loss @ 50mA |
|---------------------|--------------|-------------------|
| 1N4007 Diode        | ~0.7V        | 35mW              |
| Schottky 1N5817     | ~0.3V        | 15mW              |
| P-MOSFET AO3401A    | ~2.2mV       | 0.11mW            |

The MOSFET method is **300x more efficient** than a standard diode.

---

### 3. TVS Diode (ESD / Transient Protection)

**Component:** SMBJ9.0A or P6KE10A (Unidirectional)

| Parameter              | SMBJ9.0A Value |
|------------------------|----------------|
| Standoff Voltage (VWM) | 9.0V           |
| Breakdown Voltage      | 10.0V (min)    |
| Clamping Voltage       | 14.5V @ 1A     |
| Peak Pulse Power       | 600W           |
| Package                | SMB            |

**Wiring:**

```
   Protected Rail (+) ──────┬────────────────────▶ To Regulator
                            │
                       ┌────┴────┐
                       │   TVS   │ (Cathode to +, Anode to GND)
                       │ SMBJ9.0A│
                       └────┬────┘
                            │
   Ground (GND) ────────────┴────────────────────▶ Common Ground
```

**How It Works:**
- During normal operation (V < 9V), the TVS diode is essentially an open circuit (high impedance).
- When a transient spike (ESD, inductive kickback) exceeds the breakdown voltage (~10V), the TVS clamps the voltage by conducting heavily to ground.
- The clamping voltage (14.5V max) protects the downstream regulator's 25V maximum input rating.

---

## Regulation Stage

### 4. L7805CV Linear Voltage Regulator

**Component:** L7805CV (TO-220 package) or MC7805 or LM7805

| Parameter              | Value            |
|------------------------|------------------|
| Output Voltage         | 5.0V ±4%         |
| Input Voltage Range    | 7V to 25V        |
| Dropout Voltage        | ~2.0V            |
| Output Current         | Up to 1.5A       |
| Built-in Thermal Protection | Yes         |
| Built-in Short-Circuit Protection | Yes    |
| Package                | TO-220           |

**Pinout:**

```
         ┌───────────┐
         │  L7805CV  │
         │           │
   ┌─────┤ 1   2   3 ├─────┐
   │     └───────────┘     │
   │           │           │
  IN          GND         OUT
(7-25V)                  (5.0V)
```

**Why L7805 Works Here:**

| Parameter                   | Our System      | L7805 Requirement |
|-----------------------------|-----------------|-------------------|
| Input Voltage (Li-Ion 9V)   | 7.4V - 8.4V     | ≥ 7V ✅           |
| Dropout Voltage             | 7.4 - 5.0 = 2.4V| ~2.0V ✅          |
| Load Current                | ~50-100mA       | Up to 1.5A ✅     |

**Heat Dissipation Check:**
- Worst case: Input = 8.4V, Output = 5.0V, Current = 100mA
- Power dissipated: P = (8.4 - 5.0) × 0.1 = **0.34W**
- This is well within the L7805's capability without a heatsink for short-term use.
- For extended operation, consider a small heatsink or thermal pad.

---

### 5. Filter Capacitors

| Position | Capacitor | Value   | Type            | Purpose                        |
|----------|-----------|---------|-----------------|--------------------------------|
| Input    | C1        | 0.33µF  | Ceramic (MLCC)  | Prevents oscillation, filters HF noise |
| Output   | C2        | 0.1µF   | Ceramic (MLCC)  | Stability, filters HF noise    |
| Output   | C3        | 10µF    | Electrolytic/Tantalum | Bulk capacitance, load transients |

**Placement:** Capacitors MUST be placed as close as possible to the regulator pins.

---

## Complete Schematic

```
                                                    
   9V Li-Ion              PTC          P-MOSFET         TVS              L7805
   Battery               Fuse         AO3401A        SMBJ9.0A          Regulator
                                                                           
     (+) ─────┬──────[RXEF010]─────┬─────(S)─────────┬────────────┬────────[1]─────┬─────[3]───────┬───▶ +5V OUT
              │                   │      │          │            │                │               │
              │                   │      │          │            │               C1              C2
              │                   │    (D)─────────▶│            │             0.33µF          0.1µF
              │                   │                 │         (CATHODE)          │               │
              │                   │                 │            │                │               │
              │                  (G)                │            │                │               │
              │                   │                 │            │                │               │
     (-) ─────┴───────────────────┴─────────────────┴──(ANODE)───┴────────[2]─────┴───────────────┴───▶ GND
                                                                      (GND)
```

**ASCII Schematic (Simplified Netlist):**

```
1. Battery (+) → PTC Fuse (Pin 1)
2. PTC Fuse (Pin 2) → MOSFET Source (S)
3. MOSFET Gate (G) → Battery (-) / Ground
4. MOSFET Drain (D) → TVS Cathode → L7805 Input (Pin 1)
5. TVS Anode → Ground
6. L7805 Ground (Pin 2) → Ground
7. L7805 Output (Pin 3) → 5V Rail
8. C1 (0.33µF) → Between L7805 Input and Ground
9. C2 (0.1µF) → Between L7805 Output and Ground
10. C3 (10µF) → Between 5V Rail and Ground (optional but recommended)
```

---

## Bill of Materials (BOM)

| Ref | Component          | Value/Part Number | Quantity | Package   | Notes                           |
|-----|--------------------|-------------------|----------|-----------|--------------------------------|
| B1  | 9V Li-Ion Battery  | EBL 9V Li-Ion     | 1        | PP3       | 7.4V nom, 620mAh               |
| F1  | PTC Fuse           | RXEF010           | 1        | Radial    | 100mA hold, 200mA trip         |
| Q1  | P-MOSFET           | AO3401A           | 1        | SOT-23    | Reverse polarity protection     |
| D1  | TVS Diode          | SMBJ9.0A          | 1        | SMB       | ESD/transient protection        |
| U1  | Voltage Regulator  | L7805CV           | 1        | TO-220    | 5V, 1.5A linear regulator       |
| C1  | Ceramic Capacitor  | 0.33µF / 330nF    | 1        | 0805/THT  | Input filter                    |
| C2  | Ceramic Capacitor  | 0.1µF / 100nF     | 1        | 0805/THT  | Output filter                   |
| C3  | Electrolytic Cap   | 10µF / 16V        | 1        | Radial    | Output bulk (optional)          |
| J1  | Battery Snap       | 9V PP3 Connector  | 1        | -         | Hard plastic type preferred     |

---

## LED Power Indicator (Optional)

To indicate power is present, add a "POWER ON" LED:

```
   +5V ───────[R_LED]─────────┬─────────▶│──────── GND
              (220Ω)          │        (LED)
                              │
                           (Anode)
```

| LED Color | Forward Voltage | R_LED Value | LED Current |
|-----------|-----------------|-------------|-------------|
| Red       | ~2.0V           | 150Ω        | ~20mA       |
| Green     | ~2.2V           | 140Ω        | ~20mA       |
| Blue      | ~3.2V           | 82Ω         | ~22mA       |

Formula: R = (V_supply - V_LED) / I_LED

---

## Efficiency Analysis

### Power Budget

| Stage                  | Voltage In | Voltage Out | Loss           |
|------------------------|------------|-------------|----------------|
| PTC Fuse               | 8.4V       | 8.4V        | ~0V (negligible)|
| P-MOSFET               | 8.4V       | 8.398V      | ~2mV           |
| TVS Diode              | 8.4V       | 8.4V        | 0V (standby)   |
| L7805 Regulator        | 8.4V       | 5.0V        | **3.4V**       |

**Total Efficiency:** η = (5.0V / 8.4V) × 100% = **~60%**

At 50mA load:
- Power in: 8.4V × 50mA = 420mW
- Power out: 5.0V × 50mA = 250mW
- Power lost (heat): 170mW (mostly in regulator)

---

## Safety Warnings

⚠️ **Lithium Battery Safety:**
- Never short-circuit a Li-Ion battery
- Do not expose to temperatures above 60°C
- Use only compatible chargers (typically USB-based 9V Li-Ion chargers)
- Store at 50% charge for long-term storage

⚠️ **Capacitor Polarity:**
- Electrolytic capacitors (C3) have polarity. Ensure (+) goes to the power rail.
- Reversed electrolytic capacitors can explode.

⚠️ **Regulator Heat:**
- At high currents (>200mA), the L7805 will get hot. Use a heatsink if needed.

---

## Testing Procedure

1. **Visual Inspection:** Check all connections before powering on.
2. **Measure Input:** Confirm battery voltage (should be 7.4V - 8.4V).
3. **Measure Output (No Load):** Should read 5.0V ±0.2V.
4. **Measure Output (With Load):** Connect the main schematic. Should remain ~5.0V.
5. **Reverse Polarity Test:** Carefully connect battery backwards. No damage should occur, and no current should flow.
6. **Short Circuit Test:** Briefly short the output. The PTC fuse should trip (output goes to ~0V). Remove short, wait 30 seconds, and power should restore.

---

## Alternatives Considered

| Alternative              | Pros                          | Cons                             | Verdict      |
|--------------------------|-------------------------------|----------------------------------|--------------|
| 2×AA Alkaline (3V)       | Cheap, common                 | LM324 won't work at 3V           | ❌ Rejected  |
| 4×AA Alkaline (6V)       | Higher voltage                | Bulky, non-rechargeable          | ⚠️ Possible  |
| 9V Alkaline + L7805      | Simple                        | Non-rechargeable, voltage sags   | ⚠️ Possible  |
| **9V Li-Ion + L7805**    | Rechargeable, stable voltage  | Slightly higher cost             | ✅ **Chosen** |
| USB Power Bank + Buck    | Very stable                   | External device, not self-contained | ❌ Rejected |

---

## Conclusion

This power solution provides a **robust, protected, and stable 5V supply** for the analog light measurement circuit. The 9V Li-Ion battery offers good capacity and rechargeability, while the L7805 linear regulator provides simple, noise-free regulation. The protection stages ensure the circuit survives common abuse scenarios including reverse battery insertion, static discharge, and accidental short circuits.

**Total Component Cost (Estimate):** ~€5-8 (excluding battery)

---

## References

- [LM7805 Datasheet - Components101](https://components101.com/ics/7805-voltage-regulator-ic-pinout-datasheet)
- [TVS Diode Selection - Littelfuse](https://www.littelfuse.com/products/tvs-diodes.aspx)
- [P-Channel MOSFET Reverse Protection - YouTube (Haase Industries)](https://www.youtube.com/watch?v=IrB-FPcv1Dc)
- [Nine-volt Battery - Wikipedia](https://en.wikipedia.org/wiki/Nine-volt_battery)
- [LM324 Datasheet - Texas Instruments](https://www.ti.com/lit/ds/symlink/lm324.pdf)

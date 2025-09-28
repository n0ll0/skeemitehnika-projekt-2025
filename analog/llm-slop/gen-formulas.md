# Formula generation and tools

## Ladder calculator (JS)

We added a small Node.js tool to compute R1–R4 for the 4-resistor ladder and suggest practical combinations from the kit.

- Script: `analog/tools/ladder-calc.js`
- Example run:

```powershell
node analog/tools/ladder-calc.js --vin 5 --v1 3.25 --v2 1.7 --v3 0.1 --rtot 100000 --tol 0.01 --max-series 5 --inventory
```

Flags:

- `--vin` supply voltage (default 5)
- `--v1 --v2 --v3` target node voltages (required)
- `--rtot` total series resistance; or use `--current-uA` to set divider current
- `--tol` relative tolerance for matching discrete combos (default 0.01 = 1%)
- `--max-series` maximum parts per resistor leg (default 4)
- `--inventory` use the default kit inventory from `kohvri-komponendiloend.md`
- `--no-search` skip discrete combo search


## Derivation: 4‑resistor reference ladder (5V → V1, V2, V3 → 0V)

Assumptions

- Single series chain R1–R4 from +5 V to 0 V, no load on taps (op-amp inputs are high impedance).
- Taps: V1 at node between R1–R2, V2 at node between R2–R3, V3 at node between R3–R4.
- Targets from measurement: V1 = 3.25 V, V2 = 1.70 V, V3 = 0.10 V (we design to the upper bound for “≤ 0.1 V”).

Let the series current be $I$ and total resistance be $S_\text{tot} = R_1+R_2+R_3+R_4$.

$$
I = \frac{5}{S_\text{tot}}
$$

Node voltages (referenced to ground) follow directly from Ohm’s law because the same current $I$ flows through each resistor:

$$
\begin{aligned}
V_3 &= I\,R_4,\\
V_2 &= I\,(R_3+R_4),\\
V_1 &= I\,(R_2+R_3+R_4),\\
5   &= I\,(R_1+R_2+R_3+R_4)=I\,S_\text{tot}.
\end{aligned}
$$

It is convenient to express each resistor by the voltage drop across it:

$$
\begin{aligned}
\Delta V_1 &= 5 - V_1,\\
\Delta V_2 &= V_1 - V_2,\\
\Delta V_3 &= V_2 - V_3,\\
\Delta V_4 &= V_3 - 0 = V_3.
\end{aligned}
\qquad\Rightarrow\qquad
R_k
= \frac{\Delta V_k}{I}
= \Delta V_k\,\frac{S_\text{tot}}{5}.
$$

Therefore the resistor ratios are uniquely determined by the desired node voltages:

$$
R_1 : R_2 : R_3 : R_4 \;=\; (5{-}V_1) : (V_1{-}V_2) : (V_2{-}V_3) : (V_3{-}0).
$$

Closed‑form (choose any convenient $S_\text{tot}$ to set absolute values):

$$
\begin{aligned}
R_1 &= \frac{5 - V_1}{5}\,S_\text{tot},\\
R_2 &= \frac{V_1 - V_2}{5}\,S_\text{tot},\\
R_3 &= \frac{V_2 - V_3}{5}\,S_\text{tot},\\
R_4 &= \frac{V_3 - 0}{5}\,S_\text{tot}.
\end{aligned}
$$

Numerical example (pick $S_\text{tot} = 100\,\text{k}\Omega$ → divider current $I = 5/100\,\text{k}\Omega = 50\,\mu\text{A}$):

$$
\begin{aligned}
R_1 &= \tfrac{5-3.25}{5}\cdot 100\,\text{k}\Omega = 35.0\,\text{k}\Omega,\\
R_2 &= \tfrac{3.25-1.70}{5}\cdot 100\,\text{k}\Omega = 31.0\,\text{k}\Omega,\\
R_3 &= \tfrac{1.70-0.10}{5}\cdot 100\,\text{k}\Omega = 32.0\,\text{k}\Omega,\\
R_4 &= \tfrac{0.10-0}{5}\cdot 100\,\text{k}\Omega = 2.0\,\text{k}\Omega.
\end{aligned}
$$

Practical picks from our kit (exact ratios with available values; fine‑tune if needed with 10k trimmers):

- $R_4 \approx 2.00\,\text{k}\Omega$ → 1k + 1k in series.
- $R_3 \approx 32.0\,\text{k}\Omega$ → 10k + 10k + 10k + 1k + 1k.
- $R_2 \approx 31.0\,\text{k}\Omega$ → 10k + 10k + 10k + 1k.
- $R_1 \approx 35.0\,\text{k}\Omega$ → 10k + 10k + 10k + 4.7k + 220Ω + 100Ω (≈ 35.02 kΩ).

Checks (with $S_\text{tot}\approx 100.0\,\text{k}\Omega$):

$$
\begin{aligned}
V_3 &\approx 5\cdot \frac{R_4}{S_\text{tot}} \approx 0.100\,\text{V},\\
V_2 &\approx 5\cdot \frac{R_3+R_4}{S_\text{tot}} \approx 1.70\,\text{V},\\
V_1 &\approx 5\cdot \frac{R_2+R_3+R_4}{S_\text{tot}} \approx 3.25\,\text{V}.
\end{aligned}
$$

Notes

- Scale freedom: any $S_\text{tot}$ works; larger values reduce divider current. 100 kΩ gives a modest 50 µA, good for a stable reference.
- Tolerance: use a 10 kΩ trimmer in series with $R_2$ and/or $R_3$ if you want to trim the 300 lx and 500 lx thresholds exactly during calibration with a luxmeter.
- Loading: keep the comparator/op‑amp inputs high‑impedance (MCP6002 input bias is very low), or buffer the taps if you later add loads.

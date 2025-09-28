#!/usr/bin/env node
/**
 * Ladder calculator for 4-resistor series divider producing taps V1, V2, V3 from Vin.
 *
 * Model (top to bottom): +Vin — R1 —(V1)— R2 —(V2)— R3 —(V3)— R4 — 0V
 * No load on taps (comparator inputs are high-Z).
 *
 * Formulas (ratios are unique):
 *   R1 : R2 : R3 : R4 = (Vin-V1) : (V1-V2) : (V2-V3) : (V3-0)
 * For any chosen total S = R1+R2+R3+R4:
 *   R1 = ((Vin-V1)/Vin) * S, R2 = ((V1-V2)/Vin) * S, R3 = ((V2-V3)/Vin) * S, R4 = (V3/Vin) * S
 *
 * CLI options:
 *   --vin <V>            Supply (default 5)
 *   --v1 <V> --v2 <V> --v3 <V>   Target node voltages (required)
 *   --rtot <ohms>        Total series resistance S (e.g., 100000)
 *   --current-uA <µA>    Alternative to rtot: choose S = Vin / (current-uA * 1e-6)
 *   --tol <fraction>     Matching tolerance for discrete picks (default 0.01 = 1%)
 *   --max-series <n>     Max parts per leg when picking from inventory (default 4)
 *   --no-search          Do not try to find discrete combos
 *   --inventory          Use default kit inventory (hardcoded below)
 */

const args = process.argv.slice(2);

function getArg(flag, def = undefined) {
  const i = args.indexOf(flag);
  if (i >= 0 && i + 1 < args.length) return args[i + 1];
  return def;
}

function hasFlag(flag) {
  return args.includes(flag);
}

function parseNumber(name, val, required = false) {
  if (val === undefined || val === null) {
    if (required) throw new Error(`Missing required ${name}`);
    return undefined;
  }
  const n = Number(val);
  if (!Number.isFinite(n)) throw new Error(`Invalid number for ${name}: ${val}`);
  return n;
}

function calcResistors({ vin, v1, v2, v3, rtot }) {
  if (!(v3 <= v2 && v2 <= v1 && v1 <= vin)) {
    throw new Error(`Require 0 ≤ V3 ≤ V2 ≤ V1 ≤ Vin; got V1=${v1}, V2=${v2}, V3=${v3}, Vin=${vin}`);
  }
  const r1 = ((vin - v1) / vin) * rtot;
  const r2 = ((v1 - v2) / vin) * rtot;
  const r3 = ((v2 - v3) / vin) * rtot;
  const r4 = (v3 / vin) * rtot;
  return { r1, r2, r3, r4 };
}

function calcNodesFromR({ vin, r1, r2, r3, r4 }) {
  const s = r1 + r2 + r3 + r4;
  const i = vin / s;
  const v3 = i * r4;
  const v2 = i * (r3 + r4);
  const v1 = i * (r2 + r3 + r4);
  return { v1, v2, v3, current: i };
}

// Default inventory based on kohvri-komponendiloend.md
function defaultInventory() {
  // ohms: count
  return new Map([
    [100, 5],
    [220, 10],
    [1000, 20],
    [4700, 5],
    [10000, 10],
    [47000, 5],
    [100000, 5],
    [1000000, 5],
  ]);
}

function cloneInventory(inv) {
  return new Map(inv);
}

function invToArray(inv) {
  return Array.from(inv.entries()).map(([ohms, count]) => ({ ohms, count })).sort((a, b) => a.ohms - b.ohms);
}

// Generate combinations (series) up to maxParts from inventory, without exceeding counts.
// We pick in nondecreasing order of value to avoid permutations.
function findBestSeriesSum(target, tol, inv, maxParts) {
  const parts = invToArray(inv);
  let best = null; // {sum, picks: Map(ohms->qty)}
  const low = target * (1 - tol);
  const high = target * (1 + tol);

  function consider(picks) {
    const sum = Array.from(picks.entries()).reduce((acc, [ohm, qty]) => acc + ohm * qty, 0);
    if (sum >= low && sum <= high) {
      const err = Math.abs(sum - target);
      const partCount = Array.from(picks.values()).reduce((a, b) => a + b, 0);
      const score = err + partCount * 1e-6; // prefer fewer parts for same error
      if (!best || score < best.score) {
        best = { sum, picks: new Map(picks), err, partCount, score };
      }
    }
  }

  function dfs(idx, remainingParts, picks, minOhm) {
    if (remainingParts === 0) {
      consider(picks);
      return;
    }
    // Try no further additions
    consider(picks);

    for (let i = idx; i < parts.length; i++) {
      const { ohms, count } = parts[i];
      if (ohms < minOhm) continue; // enforce nondecreasing to avoid duplicates
      const already = picks.get(ohms) || 0;
      if (already >= count) continue; // respect inventory counts

      // Quick bound: optimistic max additional sum if we filled remaining with biggest values
      // Skipped for simplicity; rely on small search space.

      // Add one of this value
      picks.set(ohms, already + 1);
      const currentSum = Array.from(picks.entries()).reduce((acc, [o, q]) => acc + o * q, 0);
      // Prune if already far above high
      if (currentSum <= high) {
        dfs(i, remainingParts - 1, picks, ohms);
      }
      picks.set(ohms, already);
      if (already === 0) picks.delete(ohms);
    }
  }

  dfs(0, maxParts, new Map(), 0);
  return best; // may be null if not found
}

function applyPicksToInventory(inv, picks) {
  for (const [ohm, qty] of picks.entries()) {
    const have = inv.get(ohm) || 0;
    if (qty > have) throw new Error(`Inventory underflow for ${ohm}Ω: need ${qty}, have ${have}`);
    inv.set(ohm, have - qty);
  }
}

function formatPicks(picks) {
  const arr = Array.from(picks.entries()).sort((a, b) => a[0] - b[0]);
  return arr.map(([ohm, qty]) => `${qty}×${humanOhm(ohm)}`).join(" + ");
}

function humanOhm(x) {
  if (x >= 1e6) return `${(x / 1e6).toFixed(x % 1e6 ? 3 : 0)} MΩ`;
  if (x >= 1e3) return `${(x / 1e3).toFixed(x % 1e3 ? 3 : 0)} kΩ`;
  return `${x} Ω`;
}

function main() {
  try {
    const vin = parseNumber('vin', getArg('--vin', '5'));
    const v1 = parseNumber('v1', getArg('--v1'), true);
    const v2 = parseNumber('v2', getArg('--v2'), true);
    const v3 = parseNumber('v3', getArg('--v3'), true);

    let rtot = parseNumber('rtot', getArg('--rtot'));
    const current_uA = parseNumber('current-uA', getArg('--current-uA'));
    if (rtot === undefined && current_uA !== undefined) {
      rtot = vin / (current_uA * 1e-6);
    }
    if (rtot === undefined) {
      rtot = 100_000; // sensible default
    }

    const tol = parseNumber('tol', getArg('--tol', '0.01'));
    const maxSeries = parseNumber('max-series', getArg('--max-series', '4'));
    const doSearch = !hasFlag('--no-search');
    const useInv = hasFlag('--inventory');

    const { r1, r2, r3, r4 } = calcResistors({ vin, v1, v2, v3, rtot });
    const { v1: pv1, v2: pv2, v3: pv3, current } = calcNodesFromR({ vin, r1, r2, r3, r4 });

    console.log('Inputs:');
    console.log(`  Vin=${vin} V, targets: V1=${v1} V, V2=${v2} V, V3=${v3} V`);
    console.log(`  Total S=${Math.round(rtot)} Ω, divider current ≈ ${(current * 1e6).toFixed(2)} µA`);
    console.log('Exact resistor values (from formulas):');
    console.log(`  R1=${r1.toFixed(2)} Ω, R2=${r2.toFixed(2)} Ω, R3=${r3.toFixed(2)} Ω, R4=${r4.toFixed(2)} Ω`);
    console.log(`  Predicted nodes with exact R: V1=${pv1.toFixed(3)} V, V2=${pv2.toFixed(3)} V, V3=${pv3.toFixed(3)} V`);

    if (doSearch) {
      let inv = useInv ? defaultInventory() : defaultInventory(); // default to kit; could extend later
      inv = cloneInventory(inv);
      console.log(`\nSearching discrete combinations (tol=±${(tol * 100).toFixed(2)}%, max ${maxSeries} in series per leg) …`);
      const legs = [
        { name: 'R4', target: r4 },
        { name: 'R3', target: r3 },
        { name: 'R2', target: r2 },
        { name: 'R1', target: r1 },
      ];
      const picksOut = {};
      for (const leg of legs) {
        const best = findBestSeriesSum(leg.target, tol, inv, maxSeries);
        if (!best) {
          console.log(`  ${leg.name}: no combo found within tolerance. Consider relaxing tol or increasing max-series.`);
          continue;
        }
        applyPicksToInventory(inv, best.picks);
        picksOut[leg.name] = best;
        console.log(
          `  ${leg.name}: ${formatPicks(best.picks)} ≈ ${best.sum.toFixed(2)} Ω` +
            ` (err ${(best.err).toFixed(2)} Ω, parts ${best.partCount})`
        );
      }

      if (picksOut.R1 && picksOut.R2 && picksOut.R3 && picksOut.R4) {
        const R1s = picksOut.R1.sum;
        const R2s = picksOut.R2.sum;
        const R3s = picksOut.R3.sum;
        const R4s = picksOut.R4.sum;
        const nodes = calcNodesFromR({ vin, r1: R1s, r2: R2s, r3: R3s, r4: R4s });
        console.log('\nPredicted nodes with discrete picks:');
        console.log(
          `  V1=${nodes.v1.toFixed(3)} V, V2=${nodes.v2.toFixed(3)} V, V3=${nodes.v3.toFixed(3)} V; ` +
            `current ≈ ${(nodes.current * 1e6).toFixed(2)} µA`
        );
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Usage: node analog/tools/ladder-calc.js --vin 5 --v1 3.25 --v2 1.7 --v3 0.1 --rtot 100000 --tol 0.01 --max-series 4 --inventory');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

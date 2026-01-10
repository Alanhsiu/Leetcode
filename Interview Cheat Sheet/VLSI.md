# VLSI & Digital Design Interview Cheat Sheet

## 1. Power Consumption (The "Power Wall")
* **Why it matters**: Power limits how fast we can run the CPU (heat) and battery life.
* **Dynamic Power (Active)**: Energy used when transistors switch (0 → 1).
    * $P = \alpha \cdot C \cdot V^2 \cdot f$
    * *$\alpha$*: Activity Factor (How often it switches).
    * *$C$*: Capacitance (Load).
    * *$V$*: Voltage (The biggest factor because it is squared).
    * *$f$*: Frequency (Speed).
    * *How to save*: **Clock Gating** (turn off clocks for idle blocks) or **DVFS** (Dynamic Voltage and Frequency Scaling).
* **Static Power (Leakage)**: Energy leaked even when the CPU is doing nothing.
    * *Cause*: Transistors are getting tiny (7nm, 3nm) and don't turn off completely.
    * *How to save*: **Power Gating** (cut off the power supply entirely).

## 2. Timing & Frequency (The Speed Limit)

#### Setup Time
- **Minimum time data must be stable BEFORE the clock edge**
- Checks if current data arrives early enough at Capture FF
- **Check**: `Data Arrival Time ≤ Data Required Time (Clock Arrival Time - Setup Time)` (at Capture FF)
- **Slack**: `Data Required Time - Data Arrival Time` (positive = pass, negative = violation)
- **Why violation happens?**
  - Long combinational delay
  - Large clock skew (negative)
  - High clock uncertainty
  - Slow input arrival time
- **Violation**: Data arrives too late → FF tries to capture while data is still changing → captures corrupted/wrong value → chip computes incorrect results
- **Fix**: Make path faster
  - Upsize cells = use bigger/stronger gates (drive faster)
  - Shorten wires = improve placement to reduce wire delay
  - Lower Vt = use faster transistors (but consume more power)
  - Slow clock = increase clock period (reduce frequency)
  - Pipeline design (add registers) = break long path into multiple cycles (architectural change)

#### Hold Time
- **Minimum time data must be stable AFTER the clock edge**
- Checks if next data arrives too quickly at Capture FF
- **Check**: `Data Arrival Time ≥ Data Required Time (Clock Arrival Time + Hold Time)` (next data at Capture FF)
- **Slack**: `Data Arrival Time - Data Required Time` (positive = pass, negative = violation)
- **Why violation happens?**
  - Path too fast (short delay)
  - Large positive clock skew
  - Clock tree imbalance
- **Violation**: Next data arrives too fast → FF hasn't finished latching current data yet → accidentally captures the new data instead of the intended old data → wrong value stored and propagates through circuit
- **Fix**: Make path slower
  - Add delay buffers = insert buffers to slow down signal
  - Downsize cells = use smaller/weaker gates (slower)
  - Useful skew = adjust clock arrival timing
- **Key difference**: Cannot fix by changing clock frequency (frequency-independent)

#### Slack
- **Slack = Required Time - Arrival Time** (for Setup, most common)
- Positive slack = pass ✓, Negative slack = violation ✗
- **Hold slack uses opposite sign**: Arrival Time - Required Time

#### Critical Path
- Path with the worst slack (most negative or least positive)
- **Setup critical path**: Longest delay path → limits max frequency
- **Hold critical path**: Shortest delay path → may cause hold violations
- **Max Frequency = 1 / (Critical Path Delay + Setup Time + Clock Uncertainty)**

#### Clock Skew
- Difference in arrival time of clock signal at different registers
- **Positive skew**: Launching clock arrives before capturing clock
- **Negative skew**: Capturing clock arrives before launching clock

## 3. CMOS Fundamentals (The Physics)

* **Inverter**: The basic building block.
    * **PMOS** (Top): Pulls up to 1 (Good at passing 1s).
    * **NMOS** (Bottom): Pulls down to 0 (Good at passing 0s).
* **RC Delay**: Wires have Resistance (R) and Gates have Capacitance (C). Charging them takes time. In modern chips, **Wire Delay** is often worse than Logic Delay.

## 4. Verilog Basics (For Reading Code)
* **Modules**: The building blocks (like Classes in C++).
* **Blocking Assignment (`=`)**:
    * Executes line-by-line (Sequential).
    * Used for **Combinational Logic** (AND, OR, MUX).
* **Non-Blocking Assignment (`<=`)**:
    * Executes all at once (Parallel) at the clock edge.
    * Used for **Sequential Logic** (Flip-Flops/Registers).
* **Common Hardware Patterns**:
    * `if/else` or `case` → becomes a **Multiplexer (MUX)**.
    * `always @(posedge clk)` → becomes a **Flip-Flop**.

## 5. System Design Q&A (Connecting to Architecture)
* **Q: How do we make a CPU faster?**
    * *A*: Deepen the pipeline (split the Critical Path into smaller chunks) to increase frequency. *Trade-off*: Higher power and higher penalty for branch misprediction.
* **Q: Why don't we just increase voltage to run faster?**
    * *A*: Because Power = $V^2$. A small increase in speed causes a huge increase in heat/power.
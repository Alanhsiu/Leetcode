# ⚡️ HARDWARE & SI CHEAT SHEET

---

## 1. BASICS & GOALS

### Signal Integrity (SI)
**Definition:** The quality of the electrical signal.
**Goal:** To transmit data (0s and 1s) without errors.
**Why it matters:** At high speeds, signals can degrade due to various effects (reflections, loss, crosstalk).

### Transmission Line Theory
**Definition:** A theory used when the wavelength of a signal is comparable to or smaller than the physical length of the wire.
**Key Property:** The wire is modeled as a network of **Distributed Inductance (L)** and **Capacitance (C)**.
**Characteristic Impedance ($Z_0$):** Defined by the ratio of L and C ($\sqrt{L/C}$). It is the "impedance" a signal sees as it travels. 
**At 224 Gbps:** We treat every trace as a Transmission Line.

### Square Wave
**Definition:** The ideal shape of a digital signal. Consists of many odd harmonics.
**Good signal data transmission** requires constant amplitude change / time shift for all frequencies. If not, distortion occurs.

### Rise Time
**Definition:** Time to go from **10% to 90%** voltage.
**Meaning:** Short Rise Time = High Speed = High Frequency.

### The Channel
**Definition:** The physical path (PCB trace, cable, connector).
**Effect:** It acts as a **Low-Pass Filter** (blocks high speed).
**Signal Chain:** Transmitter (or driver) → Channel (or interconnect) → Receiver.

### Frequency Response
How a system's output changes according to different input frequencies.

## 2. COMMON PROBLEMS (Impairments)

### Impedance Mismatch
**Definition:** A change in **Characteristic Impedance ($Z_0$)** along the signal path.
* Signal should see a constant $Z_0$ (e.g., 50 Ohms) from start to end.
* Mismatch -> Reflection -> Distortion.

**Common Causes:** Change in trace width, different materials, connectors.

>**Complex Impedance:** $Z=R + jX$ (Real: Resistance, Imaginary: Reactance).
>**Conjugate Match:** For maximum power transfer, Load Impedance = Complex Conjugate of Source Impedance ($Z_L = Z_S^*$).

### Reflection
**Definition:** Signal hits a mismatch and bounces back (like an echo).
**Coefficient:** Measured by $\Gamma = \frac{Z_L - Z_S}{Z_L + Z_S}$. 
If $Z_L$ (Load) equals $Z_S$ (Source), $\Gamma = 0$ (Zero reflection).

### Attenuation (Loss)
**Definition:** Signal loses energy as it travels.
**Rule:** Higher Frequency = More Loss.

### Skin Effect
**Definition:** At high speeds, current flows only on the **outer surface** (skin) of the wire.
**Cause:** Self-Inductance increases with frequency.
**Result:** Increases resistance and signal loss.

### Crosstalk
**Definition:** Interference from a neighbor wire (caused by mutual capacitance and inductance).
**Types:** Near-End Crosstalk (NEXT) and Far-End Crosstalk (FEXT).
**Can be reduced by:** Increasing spacing, minimizing parallel run lengths, using ground planes.

### Jitter
**Definition:** Variations in the timing of the signal (arrives too early or too late).
**Types:** Random Jitter, Periodic Jitter, etc.
**Result:** Causes uncertainty in sampling the bits correctly.


### Noise
**Definition:** Amplitude error (Vertical interference).
**Source:** Crosstalk Power supplies or external radiation (EMI).

### ISI (Inter-Symbol Interference)
**Definition:** Previous bits interfere with the current bit..
**Cause:** Channel distortion and reflections.
**Result:** Blurred signal levels, making it hard to distinguish 0s and 1s.



---

## 3. KEY METRICS

### S-Parameters (Scattering Parameters)
**Why we need it:** They can be cascaded to predict overall system behavior.
**Naming:** Sxy (x = output port, y = input port).
* Reflection: S11 (input match), S22 (output match).
* Transmission: S21 (gain / loss), S12 (reverse isolation).
* Lossless System: $|S_{11}|^2 + |S_{21}|^2 = 1$ (Energy Conservation).
* Lossy System: $|S_{11}|^2 + |S_{21}|^2 < 1$ (Some energy lost as heat).

#### S11 (Return Loss)
**Meaning:** How much signal **reflects** back.
**Goal:** We want it **LOW** (e.g., -20dB).

#### S21 (negative Insertion Loss)
**Meaning:** How much signal **passes** through.
**Goal:** We want it **HIGH** (close to 0dB).

### VSWR (Voltage Standing Wave Ratio)
**Definition:** A ratio measuring how much power is reflected back from the load. VSWR = $\frac{V_{max}}{V_{min}}$ = $\frac{1 + |\Gamma|}{1 - |\Gamma|} > 1$ ($\Gamma$ = Reflection Coefficient).
**Meaning:** It describes the "Standing Wave" created by the interference of Incident and Reflected waves. 
**Goal:** We want it **close to 1** (Perfect Match). If short or open, VSWR = ∞ (100% reflection).
**Reduce reflected power by:** Matching Networks, Foldback (Protect source).

### Eye Diagram
**Definition:** All data bits stacked on top of each other.
**Open Eye:** Good signal quality.
**Closed Eye:** Bad signal (Too much Jitter or Noise).

### Mask Test
**Definition:** A "Keep-Out" zone in the center of the Eye.
**Pass:** Signal never touches the mask.
**Fail:** Signal touches the mask.

### Smith Chart
**Definition:** A round plot used to visualize **Impedance**.

* **Center Point:** Perfect Match (Source Impedance, $Z_0$).
* **Horizontal Line:** Pure Resistance ($X = 0$).
    * **Left End:** Short Circuit ($0 \Omega$).
    * **Right End:** Open Circuit ($\infty \Omega$).
* **Upper Half:** Inductive ($+jX$).
* **Lower Half:** Capacitive ($-jX$).
* All points on the chart represent normalized impedance ($ Z_{load} / Z_0$).


### Crucial Concepts for 224 Gbps
**Goal:** In high-speed measurement, we want the S11 plot to be **tightly clustered around the center**.
**Matching:** If the plot moves away from the center, we use inductors or capacitors to "pull" it back to 50 $\Omega$.

---

## 4. INSTRUMENTS

### Oscilloscope (Scope)
**Domain:** Time Domain.
**Usage:** View Voltage vs. Time, Eye Diagrams, Rise Time.

### VNA (Vector Network Analyzer)
**Domain:** Frequency Domain.
**Usage:** Measure S-Parameters (S11, S21), Impedance.

### BERT (Bit Error Rate Tester)
**Usage:** Sends billions of bits to count errors. Used for final validation.

---

## 5. 224 Gbps SPECIFICS

### PAM4 (Pulse Amplitude Modulation)
**Definition:** A coding scheme often used for ultra-high speeds (like 224 Gbps).
**Difference:** It has **4 voltage levels** (00, 01, 10, 11) instead of just 2.
**Visual:** The Eye Diagram has **3 eyes** stacked vertically.

---

## 6. APPENDIX

### Lumped vs. Distributed Model
* **Lumped (Low Speed):** We assume the wire is a single node (Wavelength >> Wire Length).
* **Distributed (High Speed):** We must treat the wire as a series of L and C (Wavelength <= Wire Length).

### Network
* **Definition:** A network is a device with one or more ports.
* Each port can pass, reflect, or absorb RF energy.
* **Types:** 1-port (Antenna), 2-port (Amplifier, Filter), N-port (Complex Network).
* **How to Analyze:** Inject RF signals and measure the levels at each port (S-Parameters). Usually measured over a range of frequencies. 
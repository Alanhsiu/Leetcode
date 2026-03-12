# gCPU & Workload Analysis Cheat Sheet

## 1. The Core Problem: Why do we need this job?
* **The Problem**: Simulating a new CPU design is extremely slow. We cannot run a full application (like YouTube) on a simulator.
* **The Solution**: **Sampling**. We take small "slices" of the program that behave exactly like the full program.
* **The Goal**: To find the **"Representative Slice"**. If we simulate this 1 second, it predicts the performance of the whole hour.

## 2. SimPoint (The Magic Algorithm)
* **What is it?**: A standard method to find representative slices.
* **How it works**:
    1.  It breaks the program into chunks (Intervals).
    2.  It uses **Basic Block Vectors (BBV)** as fingerprints to group similar chunks (Clustering).
    3.  It picks **one** chunk from each group to represent them.
* **Why use it?**: It saves a lot of simulation time while keeping accuracy high.

## 3. Bottleneck Analysis (The "Doctor's Diagnosis")
* **Compute-bound (Core-bound)**:
    * The CPU is busy calculating (ALU is active). IPC is high.
    * Solution: Add more cores, increase frequency, or use SIMD (AVX).
* **Memory-bound**:
    * The CPU is stalling (waiting). It's hungry for data.
    * Solution: Add larger Caches (L2/L3) or faster RAM (Bandwidth).
* **Frontend-bound**:
    * The CPU doesn't know what to run next (Branch Mispredictions) or can't fetch code fast enough.
    * Solution: Better Branch Predictor.

## 4. Important Metrics (The Numbers)
* **CPI (Cycles Per Instruction)**: Average cycles for one instruction. (Lower is better).
* **MPKI (Misses Per Kilo-Instruction)**:
    * *Definition*: How many Cache Misses occur every 1000 instructions.
    * *Rule of Thumb*: If **MPKI is high**, the app is **Memory-bound**.
* **Path Length**: The total number of instructions to finish a task.

## 5. The Roofline Model (The Graph)
* **Concept**: A visual chart to see "What is limiting my performance?"
* **X-Axis**: **Arithmetic Intensity** (Math operations per Byte loaded).
* **Y-Axis**: **Performance** (GFLOPS).
* **The Idea**:
    * If your math intensity is **low**, you are under the "Sloped Roof" -> **Memory Bound**.
    * If your math intensity is **high**, you are under the "Flat Roof" -> **Compute Bound**.

## 6. Interview Framework: "How to analyze a slow app?"
* **Step 1 (Identify Bound)**: I would use `perf stat` to check **IPC** and **Cache Miss rate** to determine if the app is Compute-bound or Memory-bound.
* **Step 2 (Memory)**: If **Cache Misses** are high, I would examine the data access patterns to improve **Data Locality**.
* **Step 3 (Compute)**: If **Branch Mispredictions** are high, I would check the code logic to minimize pipeline stalls.

# Cheat Sheet: Functional vs. Timing Models

## 1. Quick Definitions
* **Functional Model (The "Fast-Forward")**
    * **Goal:** Correctness ($1+1=2$).
    * **Speed:** Very Fast (MIPS - Millions of Instructions Per Second).
    * **Simulates:** **ISA** (Instruction Set Architecture).
    * **Details:** Only updates PC, Registers, and Memory. **Ignores time.**
    * **Use case:** Booting the OS, checking logic, fast-forwarding to interesting parts.

* **Timing Model (The "Stopwatch")**
    * **Goal:** Performance (How many cycles?).
    * **Speed:** Very Slow (KIPS - Thousands of Instructions Per Second).
    * **Simulates:** **Micro-architecture** (Pipeline, Cache, Branch Prediction).
    * **Details:** Models delays, stalls, and cache misses.
    * **Use case:** Finding bottlenecks, profiling specific workload slices.

---

## 2. Why do we need both? (The Workflow)
*We use a hybrid approach to save simulation time.*

1.  **Fast-Forward:** Use the **Functional Model** to skip billions of uninteresting instructions (like OS boot).
2.  **Switch & Warm-up:** Switch to the **Timing Model**. Run a short "warm-up" to fill empty caches.
3.  **Measure:** Run the **Timing Model** on the "Representative Slice" to get accurate performance data (IPC, Latency).

---

## 3. Key Vocabulary (Buzzwords)
* **ISA (Instruction Set Architecture):** The software view (e.g., x86, ARM). Modeled by *Functional Models*.
* **Micro-architecture:** The hardware implementation (e.g., Pipeline depth, Cache size). Modeled by *Timing Models*.
* **Functional Warming:** Using the functional model to quickly reach a specific state before detailed simulation.
* **Cold Cache:** The state of the cache right after switching models (empty). We need "Warm-up" to fix this.

---

## 4. Interview Q&A Script

**Q: "What is the difference between Functional and Timing models?"**
> **A:** "A **Functional Model** focuses on *what* the program does (correctness) and is very fast. A **Timing Model** focuses on *how long* it takes (performance) by simulating hardware details like caches and pipelines, but it is much slower."

**Q: "Why don't we just use the Timing model for everything?"**
> **A:** "It's too slow. Simulating a full application could take weeks. We use the Functional model to fast-forward to the important parts (Representative Slices), and then switch to the Timing model for detailed analysis."
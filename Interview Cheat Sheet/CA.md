# Computer Architecture Interview Cheat Sheet

## 1. Architecture Types
* **ISA (Instruction Set Architecture)**: The set of instructions that a CPU can execute.
* **RISC (e.g., ARM, RISC-V)**: Simple instructions (1 cycle). Uses "Load/Store" model (math only happens in registers).
* **CISC (e.g., x86, PowerPC)**: Complex instructions. One instruction can do many things (Load + Math + Store).

## 2. The 5-Stage Pipeline (Classic RISC)

* **Concept**: An assembly line that runs multiple instructions at once.
* **Stage 1 (IF)**: **Instruction Fetch**. Get instruction from memory.
* **Stage 2 (ID)**: **Decode**. Figure out what to do and read registers.
* **Stage 3 (EX)**: **Execute**. Calculate the result or address.
* **Stage 4 (MEM)**: **Memory**. Read/Write to RAM (Load/Store only).
* **Stage 5 (WB)**: **Write Back**. Save result to Register.

## 3. Pipeline Hazards & Solutions
* **Structural Hazard**: Not enough hardware. *Solution*: **Separate Caches** (Split L1 Instruction/Data Caches).
* **Data Hazard**: Waiting for previous data. *Solution*: **Forwarding (Bypassing)** to pass data directly from ALU to the next instruction.
* **Control Hazard**: Branch instructions (`if/else`). *Solution*: **Branch Prediction**.
* **Pipeline Flush**: If the prediction is wrong, the CPU **deletes** all instructions in the pipeline. This is the penalty.

## 4. Performance Metrics (The Math of Speed)
* **CPI (Cycles Per Instruction)**: The average number of clock cycles needed to process one instruction. **Lower is better**.
* **IPC (Instructions Per Cycle)**: The inverse of CPI. How many instructions we finish in one tick. **Higher is better**.
* $CPU\_Time = Instruction\_Count \times CPI \times Clock\_Cycle\_Time$
* **Throughput**: How many tasks are done per second (Volume). Pipelining improves this.
* **Latency**: How long one single task takes (Response time).
* **Amdahl's Law**: The speed limit of optimization. If 10% of your program cannot be parallelized, your maximum speedup is limited, no matter how many cores you add.

## 5. Branch Prediction Strategies
* **Static Prediction**: Simple guessing. Always guess "Taken" (jump) or "Not Taken".
* **Dynamic Prediction**: Uses history to make a smart guess.
* **2-Bit Predictor**: A counter with 4 states (Strongly Taken, Weakly Taken, Weakly Not Taken, Strongly Not Taken). It requires **two** wrong guesses to change its mind. This makes it stable for loops.

## 6. Cache Concepts & Write Policies
* **Cache Line**: Data moves in chunks (e.g., 64 bytes) to use Spatial Locality.
* **Write-Through**: Data is written to **Cache and RAM** at the same time. It is safe but slow.
* **Write-Back**: Data is written **only to Cache**. It is written to RAM only when the data is removed (evicted) from the cache. It is faster but complex.
* **Cache Coherence (Snooping)**: Everyone watches the bus. If Core A changes a value, Core B sees it and marks its copy as **Invalid**.

## 7. The Memory Access Story
1.  **Virtual Address**: The CPU asks for data using a fake address.
2.  **TLB Check**: Fast hardware cache for addresses. **Hit** = Fast Physical Address. TLB (Translation Lookaside Buffer).
3.  **Page Table (PTE)**: If TLB Miss, check the slow map in RAM.
4.  **Cache Check**: Use Physical Address to check L1/L2/L3.
5.  **DRAM Access**: If Cache Miss, fetch data from Main Memory.
6.  **Page Fault**: If data is not in RAM, the OS fetches it from the **Disk**. This is extremely slow.

## 8. System Events (Context Switch vs. Page Fault)
* **Context Switch**: The OS stops Process A to run Process B. (Not a Page Fault)
    * *Cost*: It saves registers and **pollutes the Cache** (because Process B replaces Process A's data in the cache).
* **Page Fault**: An exception because data is missing from RAM.
    * *Cost*: Requires **Disk I/O**, which is millions of times slower than CPU.
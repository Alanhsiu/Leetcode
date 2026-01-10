# Operating Systems Interview Cheat Sheet

## 1. OS Basics & The Kernel
* **Operating System**: The main software that manages hardware and runs apps. Its key jobs are **Memory, Process, and File management**.
* **Kernel**: The "brain" of the OS that has full control over the system.
* **Device Driver**: Special code that acts as a translator, letting the OS talk to specific hardware (like a GPU or Mouse).
* **System Call**: A way for a user program to ask the OS for help (e.g., "Read this file").

## 2. Processes, Threads & Scheduling
* **Process vs. Thread**: A Process is a running program (isolated, safe, heavy). A Thread is a mini-unit inside a process (shares memory, fast, requires sync).
* **Context Switch**: Stopping one task to run another. It is slow because the CPU must save the state and **clears out** the fast Cache.
* **Scheduling**: How the OS decides who runs next.
    * **FCFS**: First Come, First Served. Simple, like a grocery line.
    * **Priority Scheduling**: Assign a priority to each process and run the highest priority process first.
    * **Round Robin**: FCFS with a fixed time limit (Time Slice). Good for fairness.

## 3. Memory Management
* **Virtual Memory**: Makes software think it has large, continuous memory by mapping "fake" addresses to real RAM.
* **Page Fault**: When a program needs data not currently in RAM. The OS must pause and fetch it from the slow hard drive.
* **Thrashing**: When the OS is too busy moving data in/out of RAM (swapping) instead of working. Happens when RAM is full.
* **Fragmentation**: Wasted memory space. *Internal* is wasted inside a block; *External* is wasted between blocks.

## 4. Concurrency & Locks
* **Race Condition**: A bug where two threads change shared data at the same time, causing errors.
* **Critical Section**: The specific code block that touches shared data. Only one thread should enter at a time.
* **Mutex vs. Semaphore**: A **Mutex** is a lock (only 1 owner). A **Semaphore** is a counter (allows N users at once).
* **Spinlock**: A lock where the waiting thread keeps looping ("Are you ready?"). Good for very short waits to avoid sleep overhead.

## 5. Deadlock (The "Stuck" Problem)
* **Definition**: A situation where Process A waits for B, and B waits for A. No one can proceed.
* **4 Conditions (All must happen)**:
    * **Mutual Exclusion**: Only one thread uses the resource at a time.
    * **Hold and Wait**: Holding a resource while waiting for another.
    * **No Preemption**: Resources cannot be forcibly taken away.
    * **Circular Wait**: The loop of waiting (A -> B -> A).
* **How to Handle**:
    * **Prevention**: Design the system to break one of the 4 conditions. *Example*: Always acquire locks in a **fixed order** to prevent Circular Wait.
    * **Avoidance**: The OS checks if a resource request is "safe" before granting it (e.g., **Banker's Algorithm**).
    * **Detection & Recovery**: Let deadlock happen, scan for it, and **kill a process** to break the cycle.
    * **Ostrich Algorithm**: Just ignore it. Used by Windows/Linux because deadlocks are rare and checking is expensive.

## 6. Hardware Concepts (Silicon Focus)
* **DMA (Direct Memory Access)**: Lets hardware copy data to RAM directly **without** using the CPU.
* **Polling vs. Interrupt**: Polling wastes CPU time asking "Are you done?". Interrupts let the device signal the CPU when ready.
* **Cache Coherence**: Ensures all CPU cores see the same data value, even if one core changes it in its private cache.
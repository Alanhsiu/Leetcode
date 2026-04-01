# Operating Systems Interview Cheat Sheet

## 1. OS Basics & The Kernel
* **Operating System**: The main software that manages hardware and runs apps. Its key jobs are **Memory, Process, and File management**.
* **Kernel**: The core program that manages CPU, memory, and hardware devices. It runs in Kernel Mode (full access).
* **Device Driver**: Special code that acts as a translator, letting the OS talk to specific hardware (like a GPU or Mouse).
* **System Call**: A way for a user program to ask the OS for help (e.g., "Read this file").
* **What happens during a System Call? User mode -> Kernel mode switch**
  Put arguments in registers -> Trigger trap/interrupt (e.g., int 0x80 or syscall) -> CPU switches to Kernel Mode (Ring 0) -> Kernel executes the handler -> Return to User Mode (Ring 3).

## 2. Processes, Threads & Scheduling
* **Process vs. Thread**: A Process is a running program (isolated, safe, heavy). A Thread is a mini-unit inside a process (shares memory, fast, requires sync).
* **Context Switch**: Stopping one task to run another. It is slow because the CPU must save the state and clears out the fast Cache.
* **Scheduling**: How the OS decides who runs next.
    * **FCFS**: First Come, First Served. Simple, like a grocery line.
    * **Round Robin**: FCFS with a fixed time limit (Time Slice). Good for fairness.
    * **Priority Scheduling**: Runs the highest-priority task first. *General OS (Non-preemptive)*: Waits for the current task to finish/yield. *RTOS (Preemptive)*: Immediately interrupts lower-priority tasks to guarantee strict deadlines.

## 3. Memory Management
* **Virtual Memory**: Makes software think it has large, continuous memory by mapping "fake" addresses to real RAM.
* **Page Fault**: When a program needs data not currently in RAM. The OS must pause and fetch it from the slow hard drive.
* **Thrashing**: When the OS is too busy moving data in/out of RAM (swapping) instead of working. Happens when RAM is full.
* **Fragmentation**: Wasted memory space. *Internal* is wasted inside a block; *External* is wasted between blocks.

## 3. Memory Management
* **Virtual Memory**: Maps logical addresses to physical RAM, giving programs the illusion of large, contiguous memory.
* **Page Fault**: Occurs when a program requests data not currently in RAM. The OS must fetch it from disk/secondary storage.
* **Thrashing**: The OS spends more time swapping pages in/out of RAM than executing processes.
* **Fragmentation**: Wasted memory. *Internal*: unused space inside an allocated block. *External*: free space is scattered into small, unusable chunks.
* **No MMU (Embedded Context)**: Microcontrollers often lack a Memory Management Unit, meaning **no virtual memory** (direct physical addressing). This makes dynamic allocation (`malloc`/`new`) dangerous, as external fragmentation can quickly crash the system.

## 4. Concurrency & Locks
* **Race Condition**: Multiple threads modifying shared data concurrently, causing unpredictable results.
* **Critical Section**: A code block accessing shared resources. Only one thread can execute it at a time.
* **Mutex vs. Semaphore**: A **Mutex** is an exclusive lock (1 owner). A **Semaphore** is a signaling counter for resources (allows N users).
* **Spinlock**: The thread "busy-waits" in a loop until the lock is free. Saves context switch overhead for very short waits.
* **Priority Inversion**: A low-priority task holds a lock needed by a high-priority task. Solved by **Priority Inheritance** (temporarily boosting the low-priority task).

## 5. Deadlock
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
* **DMA (Direct Memory Access)**: Allows hardware devices to read/write memory directly, offloading work from the CPU.
* **Polling vs. Interrupts**: **Polling** continuously checks device status (wastes CPU). **Interrupts** allow hardware to signal the CPU to run an **ISR** (Interrupt Service Routine) immediately.
* **ISR Golden Rules**: Keep them extremely short and fast. NEVER use blocking calls (like `printf`, `sleep`, or waiting for a mutex) inside an ISR.
* **Cache Coherence**: Ensures all CPU cores see the most up-to-date data, preventing stale reads from private caches.
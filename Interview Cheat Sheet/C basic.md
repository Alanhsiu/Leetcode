# C/C++ Interview Cheat Sheet

## 1. OOP Concepts
* **Encapsulation**: Bundling data with methods. We use `private` to hide internal state and `public` getters/setters to access it safely.
* **Abstraction**: Hiding complex implementation details. We use Abstract Classes to define *what* a system does, without showing *how* it does it.
* **Inheritance**: Creating a new class from an existing one. It establishes an "is-a" relationship to reuse code.
* **Polymorphism**: Treating different objects as the same base type. We use `virtual` functions and `override` to swap behavior at runtime. (Virtual Function allows us to override methods in subclasses.)

## 2. C vs. C++ (The Differences)
* **Memory Allocation**: C uses `malloc` and `free`, which are manual and don't initialize data. C++ uses `new` and `delete`, which are type-safe and call constructors.
* **Structs**: In C, structs are just data containers. In C++, structs are like classes; they can have methods, constructors, and inheritance.
* **References**: C only has pointers. C++ adds References, which are safer aliases that cannot be null and cannot be reassigned.
* **Overloading**: C does not support function overloading. C++ supports it by generating unique names for functions based on their arguments.

## 3. Smart Pointers (C++ Memory Safety)
* **Concept (RAII)**: We wrap raw pointers in objects so memory is automatically released when it goes out of scope.
* **Unique Pointer**: Represents exclusive ownership. It cannot be copied, only moved using `std::move`. It has very low overhead.
* **Shared Pointer**: Represents shared ownership. It uses a reference count and only deletes memory when the count hits zero.
* **Weak Pointer**: A non-owning observer for a Shared Pointer. It solves the "circular reference" problem to prevent memory leaks.

## 4. Crucial Keywords
* **static**: Inside a function, it keeps its value between calls. Globally, it limits the variable's visibility to *this file only*.
* **volatile**: Tells the compiler "do not optimize this variable" because it can be changed externally by hardware or the OS.
* **const**: Marks a variable as read-only. We often pass large objects by `const reference` to avoid copying them.
* **inline**: Suggests the compiler replace the function call with the actual code to save execution time.

## 5. System Concepts
* **Stack vs. Heap**: The Stack is for local variables and is managed automatically. The Heap is for dynamic memory and must be managed manually.
* **Memory Leak**: When we allocate memory on the Heap but forget to free it, causing the program to run out of RAM.
* **Padding**: The compiler adds empty bytes to structs to align data. This helps the CPU read memory faster.

# Why is C++ faster than Python?

### 1. Compilation vs. Interpretation
* **C++:** It is a **compiled** language. The code is translated directly into **Machine Code** that runs natively on the CPU.
* **Python:** It is an **interpreted** language. The code runs through a **Virtual Machine**, which adds a translation layer and slows it down.

### 2. Static vs. Dynamic Typing
* **C++:** Uses **Static Typing**. The compiler knows the data types (like `int`, `float`) beforehand, so the instructions are optimized.
* **Python:** Uses **Dynamic Typing**. The interpreter must check data types at **Runtime** (while the program is running). This constant checking creates significant **overhead**.

### 3. Memory Management & Garbage Collection
* **C++:** Allows **manual memory management**. Developers have full control over allocation, leading to high efficiency.
* **Python:** Uses automatic **Garbage Collection (GC)**. The GC runs in the background to clean up unused memory, which consumes extra CPU resources and causes pauses.
* **Object Overhead:** In Python, everything is an **Object** (even a simple integer), requiring more memory and processing power than C++'s primitive types.
# Qualcomm Intern Interview Cheat Sheet (Dense)

## 1. Python (Core)
**Q: List vs. Tuple?** A: **List:** `[1,2]`, Mutable, Slower. **Tuple:** `(1,2)`, Immutable, Faster, hashable (can be dict keys).
**Q: Dictionary?** A: Uses **Hash Map** for O(1) ultra-fast lookups.
**Q: `is` vs `==`?** A: `==` checks **Value** (content). `is` checks **Memory Address** (are they the exact same object?).
**Q: Shallow vs. Deep Copy?** A: **Shallow:** Copies reference. **Deep:** Copies everything recursively.
**Q: Generator (`yield`)?** A: Returns one item at a time (lazy). Saves memory compared to storing a full list.
**Q: Decorator?** A: A wrapper function (using `@`) that adds functionality (like logging) to another function without changing its code.
**Q: GIL (Global Interpreter Lock)?** A: Python runs only **one thread** at a time. For CPU tasks, use `multiprocessing`; for I/O, use threads.

## 2. SQL (Database)
**Q: Inner vs. Left Join?** A: **Inner:** Returns rows matching in **BOTH** tables. **Left:** Returns **ALL** from Left table + matches from Right (NULL if no match).
**Q: Primary vs. Foreign Key?** A: **Primary:** Unique ID for a row (e.g., StudentID). **Foreign:** Links to another table's Primary Key.
**Q: Index?** A: Data structure (B-Tree) that makes **SELECT** (Read) faster, but **INSERT/UPDATE** (Write) slower.
**Q: Normalization?** A: Organizing data to reduce redundancy (duplicates).
**Q: ACID?** A: **A**tomicity (All or nothing), **C**onsistency (Valid data), **I**solation (No interference), **D**urability (Saved forever).

## 3. Web & API (Infrastructure Dashboard)
**Q: HTML vs. DOM?** A: **HTML:** The text file. **DOM:** The tree object in memory that JS manipulates.
**Q: ID vs. Class?** A: **ID:** Unique (1 element). **Class:** Reusable (many elements).
**Q: GET vs. POST?** A: **GET:** Request data (parameters in URL). **POST:** Send data (parameters in body, safer).
**Q: Status Codes?** A: **200:** OK. **400:** Client Error (Bad Request). **404:** Not Found. **500:** Server Error.
**Q: Async/Await?** A: "Non-blocking." Allows code to wait for a DB query/API without freezing the whole program.

## 4. OS & Hardware (The "Qualcomm" Part)
**Q: Process vs. Thread?** A: **Process:** Separate program (Own memory). **Thread:** "Lightweight process" (Shares memory).
**Q: Concurrency vs. Parallelism?** A: **Concurrency:** Dealing with many things at once (Time-slicing). **Parallelism:** Doing many things at once (Multi-core).
**Q: CPU vs. GPU?** A: **CPU:** Low Latency, Complex Logic (Serial). **GPU:** High Throughput, Simple Math (Parallel).
**Q: RAM vs. Cache?** A: **Cache:** Tiny, ultra-fast memory inside CPU. **RAM:** Big, slower memory on motherboard.
**Q: Latency vs. Bandwidth?** A: **Latency:** Speed (Time to arrive). **Bandwidth:** Capacity (Amount per second).

## 5. Kubernetes & Docker (Automation)
* If Docker is a single worker, Kubernetes is the manager who coordinates the whole team.
* It handles the 'lifecycle' of containers—deploying them, scaling them up when traffic is high, and restarting them if they crash.

**Q: VM vs. Container?** A: **VM:** Virtualizes Hardware (runs full OS, heavy). **Container:** Virtualizes OS (runs just app, light).
**Q: Dockerfile vs. Image vs. Container?** A: **Dockerfile:** The recipe. **Image:** The cooked meal (static). **Container:** The meal being eaten (running instance).
**Q: Pod?** A: The smallest unit in K8s. Usually wraps one Container.
**Q: CI/CD?** A: **CI:** Continuous Integration (Auto-Test). **CD:** Continuous Deployment (Auto-Release).

## 6. GenAI
**Q: LLM Hallucination?** A: When AI confidently makes up false info.
**Q: RAG (Retrieval-Augmented Generation)?** A: Giving the AI external data (PDFs/Docs) to ground its answers and reduce hallucinations.
**Q: Prompt Engineering?** A: Crafting inputs (context/role) to get better outputs from AI.


# MCP (Model Context Protocol) Cheat Sheet

## 1. What is MCP?
* **Definition:** An open standard that connects AI Models to **Local Data** and **Tools**.
* **Purpose:** It standardizes how an AI Agent "talks" to your internal infrastructure (Databases, Logs, Files).

## 2. The 3 Components
* **1. MCP Host/Client (AI Agent):**
    * The application (e.g., VS Code, Claude Desktop).
    * It acts as the **Controller**. It manages the conversation history and tool execution loop.
* **2. MCP Server (The Tool):**
    * **Your Job:** A lightweight script (Python/TS) you build.
    * It exposes specific functions (e.g., `fetch_gpu_logs`, `query_sql`) to the Agent.
* **3. LLM (The Model):**
    * The intelligence (e.g., Claude 3.5). It decides **which** tool to call based on the user's question.

## 3. The Flow (Step-by-Step)
1. **User Query:** You ask VS Code: "Why did test #123 fail?"
2. **Intent Analysis:** The **Agent** sends the query to the **LLM**.
3. **Tool Selection:** The LLM analyzes the query and decides: "Call `get_test_logs(id=123)`."
4. **Execution:** The **Agent** tells your **MCP Server** to run that function.
5. **RAG (Retrieval):** The **MCP Server** reads the actual file from the disk and returns the content.
    * *Note:* This is **Real-time RAG**. The data is retrieved on-demand and injected into the context.
6. **Generation:** The **Agent** sends the log data back to the **LLM**
7. **Response:** The LLM processes the logs and generates a human-readable answer: "Test #123 failed due to a timeout error."

## 4. MCP vs. RAG
* **Standard RAG:** usually means looking up static documents in a Vector Database.
* **MCP:** enables **Agentic RAG**. The AI can actively use tools to fetch *live* data (like current GPU temp or running processes) to answer questions.
# Database Interview Cheat Sheet

## 1. SQL vs NoSQL
| Feature | SQL (Relational) | NoSQL (Non-Relational) |
| :--- | :--- | :--- |
| **Structure** | **Tables** with Rows & Columns (like Excel). | **Documents (JSON)**, Key-Value, or Graphs. |
| **Schema** | **Rigid**. Must define fields *before* use. | **Flexible**. Can add fields anytime. |
| **Scaling** | **Vertical** (Add CPU/RAM to one server). | **Horizontal** (Add more servers). |
| **Relationships** | **Complex**. Great for JOINing tables. | **Simple**. Joins are usually not supported. |
| **Consistency** | **ACID**. Strong consistency (Data is safe). | **Eventual**. Prioritizes speed over immediate sync. |
| **Best For** | **Transactions**, Billing, Complex Queries. | **Big Data**, Real-time Feeds, Content Storage. |
| **Examples** | MySQL, PostgreSQL, Oracle. | MongoDB, Redis, Cassandra. |

### Summary for Interview
* **SQL:** "Structured, safe, and good for complex relationships (like **Banking**)."
* **NoSQL:** "Flexible, scalable, and fast for massive data (like **Social Media Feeds**)."


## 2. Indexing (Speeding Up Search)
* **The Standard:** **B+ Tree**. 
    * *Why?* Minimizes Disk I/O. Best for **Range Queries** (scanning > or <).
    * *Complexity:* **O(log N)**.
* **Leftmost Prefix Rule:** Index on `(A, B)` acts like a Phone Book ordered by A, then B.
    * `WHERE A=1`: **FAST** (Uses index).
    * `WHERE B=2`: **SLOW** (Full scan, like finding "David" in a phone book).
* **Clustered Index:**
    * **Analogy:** Like a **Dictionary**. The words are physically sorted A-Z.
    * **Use:** Best for finding a **range** of data (e.g., "All posts from yesterday").
    * **Limit:** Only **one** per table.
* **Non-Clustered Index:**
    * **Analogy:** Like the **Index at the back of a book**. It tells you the page number (look up table).
    * **Use:** Best for looking up **specific** items (e.g., "Find user by Email").
    * **Limit:** You can have **many** of these.

## 3. Redis
* **Concept:** An **in-memory** data store (extremely fast).
* **Usage:** Caching.
* **Scenario:** Instead of hitting the slow Database every time someone views a TikTok video, you store the "Like Count" in Redis for 10x faster access.

## 4. How to Scale a Database
* **Read/Write Splitting:** 1 Master (Write) + Many Slaves (Read).
* **Sharding:** Splitting a giant table into smaller ones across different servers.

>First, I would use Read/Write Splitting to handle the high traffic, since TikTok is read-heavy (lots of viewing, less uploading).
If the data volume grows too large for one server to store, I would apply Sharding (e.g., sharding by UserID or Region) to split the data across multiple servers for horizontal scaling.

## 5. Replication (Backup)
* **What is it?** Copying data to multiple servers.
* **Master-Slave:**
    * **Master:** Handles **Writes** (New posts).
    * **Slave:** Handles **Reads** (Viewing posts).
* **Why?** If one server fails, we have a backup. It also makes reading data faster.

## 6. Graph Database 
* **What is it?** a specialized DB for connecting data.
* **Structure:** Nodes (Entities) + Edges (Relationships) + Properties (Key-value pairs).
* **Why for TikTok?**
    * SQL is too slow for "Friends of Friends" queries (too many JOINs).
    * Graph DBs (NoSQL) hop between nodes instantly.
  
* **Definition:** Each node directly stores the physical address (pointer) of its neighbors.
* **Impact:** Traversing a relationship is a direct memory access operation. **$O(1)$ per hop**
* **Contrast:** SQL requires **Index Lookups ($O(\log N)$)** for every `JOIN`, which is too slow for deep social queries.
* **Scale:** Handling **Trillions of edges** requires the $O(1)$ traversal speed that only Graph DBs provide.

## 5. ACID (The 4 Rules)
* **A (Atomicity):** All or nothing (Transaction).
* **C (Consistency):** Data stays valid based on rules.
* **I (Isolation):** Transactions don't mess with each other.
* **D (Durability):** Once saved, data stays saved (even if power goes out).

## 6. CAP Theorem (The "Pick Two" Rule)
* **Definition:** In a distributed system, you can only have two of these three:
    *  **Consistency:** Everyone sees the same data at the same time.
    *  **Availability:** The system always responds (no errors).
    *  **Partition Tolerance:** The system works even if the network breaks.
* **For Social Networks (TikTok):**
    * We choose **A + P (Availability + Partition Tolerance)**.
    * **Why?** We want users to keep scrolling even if servers have issues.
    * **Trade-off:** We accept **Eventual Consistency** (it's okay if a like count is updated a few seconds later).

## 7. Role Responsibilities Cheat Sheet

#### 1. Storage Layer (The Foundation)
* **Scale:** Handle **Trillion-scale** edges & **Billion-scale** vertices.
* **Goal:** High-performance data storage & management.
* **Key Challenge:** Seamless integration & rapid iteration.

#### 2. Graph Engine (The Core - C++/HPC)
* **System:** Develop a **Distributed Graph Database Engine**.
* **Performance:** Achieve **Millisecond-level** latency.
* **Task:** Enable **Multi-hop queries** (e.g., Friend-of-Friend) & Real-time reasoning.

#### 3. Mining Platform (The Intelligence)
* **What:** Real-time Graph Mining.
* **Output:** Extract relationships, patterns, **Clusters**, and **Communities**.
* **Impact:** Powering personalized recommendations.

#### 4. Integration (The Business Value)
* **Role:** Connect Social Graph with core systems.
* **Downstream Consumers:**
    1.  **Recommendation** (Feed)
    2.  **Search** (User/Video search)
    3.  **Risk Control** (Anti-spam/Bot detection)
    4.  **Live-streaming**
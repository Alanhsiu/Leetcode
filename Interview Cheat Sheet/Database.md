# Database Interview Cheat Sheet

## 1. SQL vs NoSQL (The Big Choice)
* **SQL (e.g., MySQL, PostgreSQL):**
    * **Schema:** Fixed, structured (tables/rows).
    * **Scaling:** **Vertical** (get a bigger server).
    * **Pros:** **ACID** compliance, handles complex joins/relationships.
    * **Use case:** User profiles, financial transactions.
* **NoSQL (e.g., MongoDB, Redis, Cassandra):**
    * **Schema:** Flexible (JSON-like, Key-Value).
    * **Scaling:** **Horizontal** (add more cheap servers).
    * **Pros:** High performance, high availability, massive data.
    * **Use case:** TikTok video likes, feed/comments, real-time analytics.



## 2. Indexing (Why is it fast?)
* **The Standard:** **B+ Tree**. 
    * *Why?* Minimizes Disk I/O. It keeps data sorted for fast search and range queries.
* **Leftmost Prefix Rule:** * If you have an index on `(A, B)`, a query for `WHERE A=1` is fast. 
    * A query for **ONLY** `WHERE B=2` is **SLOW** (index not used).



## 3. ACID (The 4 Rules)
* **A (Atomicity):** All or nothing (Transaction).
* **C (Consistency):** Data stays valid based on rules.
* **I (Isolation):** Transactions don't mess with each other.
* **D (Durability):** Once saved, data stays saved (even if power goes out).

## 4. Redis (Why every backend needs it)
* **Concept:** An **in-memory** data store (extremely fast).
* **Usage:** Caching.
* **Scenario:** Instead of hitting the slow Database every time someone views a TikTok video, you store the "Like Count" in Redis for 10x faster access.

## 5. Scaling 101
* **Read/Write Splitting:** 1 Master (Write) + Many Slaves (Read).
* **Sharding:** Splitting a giant table into smaller ones across different servers.
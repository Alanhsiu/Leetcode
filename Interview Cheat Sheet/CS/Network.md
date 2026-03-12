# Networks Interview Cheat Sheet

## 1. TCP vs UDP
* **TCP (Transmission Control Protocol):** 
    * Reliable, ordered, heavy.
    * *Use case:* Web, Email, File transfer.
* **UDP (User Datagram Protocol):** 
    * Unreliable, fast, lightweight.
    * *Use case:* Live streaming, DNS, VoIP.

## 2. TCP Connection (Handshake)
* **3-Way Handshake (Start):** SYN -> SYN-ACK -> ACK.
    * *Why 3?* To check if **both** sides can send and receive.
* **4-Way Wave (End):** FIN -> ACK ... FIN -> ACK.
    * *Why 4?* The server might still have data to send after receiving the client's FIN.

## 3. HTTP Evolution (Crucial for TikTok)
* **HTTP/1.1:** Keep-Alive (reuses connection).
    * *Problem:* One slow request blocks everyone behind it (Head-of-Line Blocking).
* **HTTP/2:** **Multiplexing**.
    * *Benefit:* Sends multiple requests in parallel over one TCP connection.
* **HTTP/3 (QUIC):** Built on **UDP**.
    * *Benefit:* Solves TCP blocking issues. Faster connection setup. Great for weak networks.

## 4. HTTPS (Security)
* **Concept:** HTTP + SSL/TLS.
* **How it works:**
    1.  **Handshake:** Uses **Asymmetric Encryption** (RSA) to safely exchange a "Session Key".
    2.  **Data Transfer:** Uses **Symmetric Encryption** (AES) with that key because it's faster.

## 5. URL to Webpage (The "Magic" Flow)
1.  **DNS (Domain Name System):** URL -> IP Address.
2.  **TCP Handshake:** Establish connection.
3.  **SSL/TLS Handshake**: Secure connection.
4.  **Send Request:** Send HTTP GET Request.
5.  **Server Resoponse:** Load Balancer (Nginx) -> Backend -> Database -> Returns HTML/JSON.
6.  **Browser:** Renders the page.

## 6. I/O Models (High Performance)
* **Blocking:** Wait until data is ready (Slow).
* **Non-Blocking:** Check, check, check (Busy waiting).
* **I/O Multiplexing (Epoll):**
    * *The Best:* Event-driven. The OS tells you **only** when data is ready.
    * *Who uses it:* Nginx, Redis, Node.js.

## 6. I/O Models

* **Blocking:** Wait for data. You do nothing until it's done. (Slow)
* **Non-Blocking:** Polling (Busy waiting).
* **I/O Multiplexing (Epoll):** A manager watches 1000+ links. It tells you exactly which ones have data. (High Performance) (Event-driven)
* **Asynchronous:** You tell the OS: "Fetch this and notify me when it's **already** in my memory." (True hands-off)

## 7. OSI Model (The 7 Layers)
* **Layer 7 - Application:** HTTP, DNS, FTP (What the user sees).
* Layer 6 - Presentation: Encryption, Compression (Data format).
* Layer 5 - Session: Manages sessions (e.g., Login sessions).
* **Layer 4 - Transport:** TCP, UDP (Handles Port numbers and Reliability).
* **Layer 3 - Network:** IP (Handles IP addresses and Routing).
* Layer 2 - Data Link: Ethernet, MAC addresses (Switches).
* Layer 1 - Physical: Cables, Fiber, Bits.

**Key interview question:** "What layer does a Load Balancer work on?"
* **L4 Load Balancer:** Forwards based on IP and Port (Fast).
* **L7 Load Balancer:** Forwards based on URL, Cookies, or HTTP Headers (Smart).

## 8. RESTful API 

### Definition
* **Restful = Representational State Transfer.**
* **What is it?** A standard architectural style for Client-Server communication using HTTP.
* **Key Concept:** Everything is a **Resource** (identified by a URL), and we manipulate these resources using **HTTP Methods**.

### Design Principles
1.  **Nouns, not Verbs:** URLs should represent *things*, not *actions*.
    * *Bad:* `POST /createSong`
    * *Good:* `POST /songs`
2.  **Use HTTP Methods:**
    * **GET:** Read data.
    * **POST:** Create data.
    * **PUT:** Update data (Replace whole object).
    * **PATCH:** Update data (Modify part of object).
    * **DELETE:** Remove data.
3.  **Stateless:** The server does not remember user state. Every request must carry its own Auth Token.
4.  **Plural Nouns:** Use `/users` instead of `/user` for consistency.
5.  **Filtering:** Use Query Parameters for sorting/filtering.
    * *Example:* `GET /songs?genre=pop` (Don't create new URLs like `/songs/pop`).

### Common Status Codes
* **200 OK:** Success.
* **201 Created:** Success (for POST).
* **400 Bad Request:** Client sent wrong data.
* **401 Unauthorized:** Missing or wrong Token.
* **403 Forbidden:** Valid Token, but no permission.
* **404 Not Found:** Resource doesn't exist.
* **500 Internal Error:** Server crashed.

### Practical Example (TikTok "Like" Feature)
* **Scenario:** A user wants to "like" a specific video (ID: 100).
* **Correct Design:** `POST /videos/100/likes`
* **Response:** `201 Created`
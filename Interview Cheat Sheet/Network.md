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
2.  **TCP:** Connect to that IP.
3.  **Request:** Send HTTP GET.
4.  **Server:** Load Balancer (Nginx) -> Backend -> Database -> Returns HTML/JSON.
5.  **Browser:** Renders the page.

## 6. I/O Models (High Performance)
* **Blocking:** Wait until data is ready (Slow).
* **Non-Blocking:** Check, check, check (Busy waiting).
* **I/O Multiplexing (Epoll):**
    * *The Best:* Event-driven. The OS tells you **only** when data is ready.
    * *Who uses it:* Nginx, Redis, Node.js.

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
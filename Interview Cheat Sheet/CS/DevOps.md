# DevOps & CI/CD

### Definitions
* **DevOps:** A culture where Developers and Operations work together to release software faster.
* **CI (Continuous Integration):**
    * Developers merge code changes frequently.
    * **Key Action:** The system automatically builds and **tests** the code.
    * **Goal:** Catch bugs early.
* **CD (Continuous Delivery):**
    * **Key Action:** Automatically deploying the code to testing or production environments.
    * **Goal:** Release features quickly and safely.

### My Google Experience

1.  **Code & Review:**
    * I used **GitOnBorg** (Version Control) and **Critique** (Code Review) to manage code changes.
2.  **CI: Build & Test:**
    * I used **Blaze** (similar to Bazel) to build the project.
    * I wrote unit tests using **gTest** and **gMock** to ensure quality.
3.  **CD: Automation:**
    * I used **Kokoro** (similar to Jenkins) to automate the testing and deployment pipeline.

### Industry Standard Tools (What TikTok likely uses)
* **Docker:** Wraps code in a container so it runs the same everywhere.
* **Kubernetes (K8s):** **Manages** and scales many containers automatically.
* **Jenkins:** A tool to automate the pipeline.
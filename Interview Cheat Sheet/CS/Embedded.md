# Protocols & Resume Cheat Sheet

## 1. Hardware Protocols Comparison

| Feature | UART | I2C | SPI | CAN Bus |
| :--- | :--- | :--- | :--- | :--- |
| **Wires** | 2 (TX, RX) | 2 (SDA, SCL) | 4+ (MOSI, MISO, SCLK, CS) | 2 (CAN_H, CAN_L) |
| **Clock (Sync)** | Asynchronous | Synchronous | Synchronous | Asynchronous (Differential) |
| **Duplex** | Full-Duplex | Half-Duplex | **Full-Duplex** | Half-Duplex |
| **Speed** | Slow | Slow / Medium | **Very Fast** | Medium (Highly Reliable) |
| **Addressing** | Point-to-Point (1 to 1) | **Device Address** (Software) | **Chip Select / CS** (Hardware) | **Message ID** (Broadcast & Priority) |
| **Key Advantage** | Simple, no clock needed | Saves pins, easy to add slaves | High data throughput | Extreme noise immunity, priority-based |
| **Your Resume / Use Case** | Debug consoles | **PMBus daemon (Google)** | Display/Flash memory | **Automotive standard (Nuro)** |

## 2. Linux I2C Code Refresher (C++ Daemon)
*In Linux user-space, I2C devices are treated as files (`/dev/i2c-X`). We use `ioctl` to talk to a specific slave address.*
```cpp
// 1. Open the I2C bus
int file = open("/dev/i2c-1", O_RDWR);

// 2. Specify the Slave Address using ioctl
int slave_addr = 0x5A; 
ioctl(file, I2C_SLAVE, slave_addr);

// 3. Write/Read data
char reg_to_read[1] = {0x00};
write(file, reg_to_read, 1); // Point to the register
char buffer[2];
read(file, buffer, 2);       // Read the data back
```
## 3. Google Internship Deep-Dive
* **Daemon**: A background process in Linux that runs continuously without user interaction.
* **PMBus (Power Management Bus)**: An extension of I2C. While I2C defines *how* to transmit bits, PMBus defines *what* those bits mean. It’s a standard set of commands specifically for power supplies (to read voltage, current, faults).
* **D-Bus**: A software message bus for Linux (**IPC - Inter-Process Communication**). I used it so my C++ daemon could safely broadcast power fault alerts to other software components in the OpenBMC ecosystem.
* **Redfish API**: A modern standard for remote server management. It replaces legacy IPMI by using modern web standards (**RESTful APIs and JSON**) to report hardware health.

## 4. RTOS and PID Controller
* **Why FreeRTOS?**: In a bare-metal loop, checking ultrasonic sensors might block motor control. FreeRTOS allowed me to create separate, deterministic **Tasks**. I gave obstacle avoidance the highest priority to ensure hard real-time safety.
* **Deterministic**: The core feature of an RTOS. It does not mean "fastest overall throughput," but it guarantees that a high-priority task will execute within a strict, predictable time limit.
* **System Tick**: The "heartbeat" of the RTOS. A hardware timer interrupt (e.g., every 1ms) that wakes up the scheduler to check if a higher-priority task is ready.

* **PID Controller**: A feedback loop for precise line tracking. 
  * **P (Proportional)**: Steers based on the current error.
  * **I (Integral)**: Corrects long-term drifting.
  * **D (Derivative)**: Predicts the future error to prevent the robot from overshooting or oscillating.
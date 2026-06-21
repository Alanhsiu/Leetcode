# CUDA Programming Cheat Sheet

## Table of Contents
1. [Program Flow](#program-flow)
2. [Thread & Memory Hierarchy](#thread--memory-hierarchy)
3. [Kernel Launch](#kernel-launch)
4. [Essential CUDA Functions](#essential-cuda-functions)
5. [Code Examples](#code-examples)
6. [Optimization Tips](#optimization-tips)

---

## Program Flow

Typical CUDA program execution:

1. **Host Code** - Initialize data on CPU
2. **cudaMalloc()** - Allocate GPU memory
3. **cudaMemcpy(H→D)** - Copy data CPU → GPU
4. **Launch Kernel** - Execute parallel code on GPU
5. **cudaMemcpy(D→H)** - Copy results GPU → CPU
6. **cudaFree()** - Clean up GPU memory

```c
int main() {
    // 1. Host setup
    float *h_data = (float*)malloc(size);
    
    // 2. Allocate device memory
    float *d_data;
    cudaMalloc(&d_data, size);
    
    // 3. Copy to device
    cudaMemcpy(d_data, h_data, size, cudaMemcpyHostToDevice);
    
    // 4. Launch kernel
    kernel<<<gridDim, blockDim>>>(d_data);
    cudaDeviceSynchronize();
    
    // 5. Copy results back
    cudaMemcpy(h_data, d_data, size, cudaMemcpyDeviceToHost);
    
    // 6. Cleanup
    cudaFree(d_data);
    free(h_data);
    return 0;
}
```

---

## Thread & Memory Hierarchy

### Thread Organization

**Grid → Blocks → Warps → Threads**

- **Grid**: Collection of blocks executing the same kernel
- **Block**: Group of threads (up to 1024 threads per block)
- **Warp**: Group of 32 threads that execute in lockstep (SIMD)
- **Thread**: Individual execution unit

### What is a Warp?

A **warp** is the fundamental execution unit in CUDA:

- **32 threads** execute together in SIMD (Single Instruction, Multiple Data) fashion
- All threads in a warp execute the **same instruction** at the same time
- Warps are **scheduled** by the hardware independently
- Blocks are automatically divided into warps (e.g., 256 threads = 8 warps)

**Key Concepts:**

1. **Warp Divergence**: When threads in a warp take different execution paths
   ```cuda
   // ✗ BAD: Causes divergence (serializes execution)
   if (threadIdx.x < 16) {
       // First 16 threads of warp execute this
   } else {
       // Last 16 threads execute this
   }
   // Both paths execute serially, reducing performance by 2x
   
   // ✓ GOOD: All threads in warp take same path
   if (blockIdx.x < 16) {
       // Entire warps diverge, not individual threads
   }
   ```

2. **Warp Scheduling**: GPU schedules warps, not individual threads
   - When one warp stalls (memory access), another warp executes
   - High occupancy = more warps available = better latency hiding

3. **Thread ID within Warp**: 
   ```cuda
   int laneId = threadIdx.x % 32;  // 0-31
   int warpId = threadIdx.x / 32;   // Which warp in the block
   ```

**Example: Warp Layout in a Block**
```
Block with 128 threads = 4 warps:
Warp 0: threads 0-31
Warp 1: threads 32-63
Warp 2: threads 64-95
Warp 3: threads 96-127
```
### Thread Indexing

```c
// 1D indexing
int tid = blockIdx.x * blockDim.x + threadIdx.x;

// 2D indexing
int x = blockIdx.x * blockDim.x + threadIdx.x;
int y = blockIdx.y * blockDim.y + threadIdx.y;
int idx = y * width + x;
```

**Built-in Variables:**
- `threadIdx.x/y/z` - Thread index within block
- `blockIdx.x/y/z` - Block index within grid
- `blockDim.x/y/z` - Threads per block
- `gridDim.x/y/z` - Blocks in grid

### CUDA Memory Hierarchy

| Memory | Location (HW) | Scope (SW) | Speed | Size | Keyword / Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Registers** | On-Chip (SRAM) | **Thread** | Fastest | Small (KB) | `int x;` (Auto vars) |
| **Local Memory** | Off-Chip (DRAM) | **Thread** | **Slow!** | Large (GB) | Register spills (Avoid!) |
| **Shared Memory** | On-Chip (SRAM) | **Block** | Very Fast | Small (KB) | `__shared__` (Inter-thread collab) |
| **Global Memory** | Off-Chip (DRAM) | **Grid** | Slow | Large (GB) | `cudaMalloc()` (Main data) |
| **Constant Memory** | Off-Chip (DRAM) | **Grid** | Fast (Cached) | Small (KB) | `__constant__` (Read-only) |

**Memory Declarations:**
```cuda
__global__ void kernel() {
    int reg_var;                      // Register
    __shared__ float shared[256];     // Shared memory
    // Global memory passed as pointer
}

__constant__ float const_data[1024];  // Constant memory
```

---

## Kernel Launch

### Kernel Definition
```cuda
__global__ void kernelName(float *data, int n) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n) {
        data[idx] = data[idx] * 2.0f;
    }
}
```

### Launch Syntax
```cuda
kernelName<<<gridDim, blockDim, sharedMemSize, stream>>>(args);
```

**Parameters:**
- `gridDim` - Number of blocks (int or dim3)
- `blockDim` - Threads per block (int or dim3)
- `sharedMemSize` - Dynamic shared memory bytes (optional, default 0)
- `stream` - CUDA stream (optional, default 0)

### Calculating Grid/Block Dimensions
```c
// 1D
int threadsPerBlock = 256;
int blocksPerGrid = (n + threadsPerBlock - 1) / threadsPerBlock;
kernel<<<blocksPerGrid, threadsPerBlock>>>(data, n);

// 2D
dim3 blockDim(16, 16);  // 256 threads per block
dim3 gridDim((width + 15) / 16, (height + 15) / 16);
kernel<<<gridDim, blockDim>>>(data, width, height);
```

### Function Qualifiers
- `__global__` - Kernel: called from host, runs on device
- `__device__` - Device function: called from device, runs on device
- `__host__` - Host function: called from host, runs on host (default)

---

## Essential CUDA Functions

### Memory Management

```c
// Allocate device memory
cudaError_t cudaMalloc(void **devPtr, size_t size);

// Free device memory
cudaError_t cudaFree(void *devPtr);

// Copy memory between host and device
cudaError_t cudaMemcpy(void *dst, const void *src, size_t count, cudaMemcpyKind kind);
// kind: cudaMemcpyHostToDevice, cudaMemcpyDeviceToHost, cudaMemcpyDeviceToDevice

// Set device memory to value
cudaError_t cudaMemset(void *devPtr, int value, size_t count);

// Unified memory (accessible from both CPU and GPU)
cudaError_t cudaMallocManaged(void **devPtr, size_t size);
```

### Synchronization

```c
// Wait for all GPU operations to complete
cudaError_t cudaDeviceSynchronize(void);

// Synchronize all threads in a block (device function)
__device__ void __syncthreads(void);
```

### Error Handling

```c
// Get last error
cudaError_t cudaGetLastError(void);

// Get error string
const char* cudaGetErrorString(cudaError_t error);

// Error checking macro
#define CUDA_CHECK(call) \
    do { \
        cudaError_t err = call; \
        if (err != cudaSuccess) { \
            fprintf(stderr, "CUDA error at %s:%d: %s\n", \
                    __FILE__, __LINE__, cudaGetErrorString(err)); \
            exit(EXIT_FAILURE); \
        } \
    } while(0)
```

### Device Management

```c
// Get number of devices
cudaError_t cudaGetDeviceCount(int *count);

// Set active device
cudaError_t cudaSetDevice(int device);

// Get device properties
cudaError_t cudaGetDeviceProperties(cudaDeviceProp *prop, int device);
```

---

## Code Examples

### Example 1: Vector Addition

```cuda
__global__ void vectorAdd(float *a, float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) { 
        c[i] = a[i] + b[i];
    }
}

int main() {
    int n = 1000;
    size_t size = n * sizeof(float);
    
    // Host memory
    float *h_a = (float*)malloc(size);
    float *h_b = (float*)malloc(size);
    float *h_c = (float*)malloc(size);
    
    // Initialize
    for (int i = 0; i < n; i++) {
        h_a[i] = i;
        h_b[i] = i * 2;
    }
    
    // Device memory
    float *d_a, *d_b, *d_c;
    cudaMalloc(&d_a, size);
    cudaMalloc(&d_b, size);
    cudaMalloc(&d_c, size);
    
    // Copy to device
    cudaMemcpy(d_a, h_a, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, h_b, size, cudaMemcpyHostToDevice);
    
    // Launch kernel
    int threadsPerBlock = 256;
    int blocksPerGrid = (n + threadsPerBlock - 1) / threadsPerBlock;
    // n is 1000 -> blocksPerGrid is 4 (round up)
    vectorAdd<<<blocksPerGrid, threadsPerBlock>>>(d_a, d_b, d_c, n);
    
    // Copy result back
    cudaMemcpy(h_c, d_c, size, cudaMemcpyDeviceToHost);
    
    // Cleanup
    cudaFree(d_a);
    cudaFree(d_b);
    cudaFree(d_c);
    free(h_a);
    free(h_b);
    free(h_c);
    
    return 0;
}
```

### Example 2: Matrix Multiplication with Shared Memory

```cuda
#define TILE_SIZE 16

__global__ void matrixMul(float *A, float *B, float *C, int M, int K, int N) {
    // Shared memory for tiles
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];
    
    int tx = threadIdx.x;
    int ty = threadIdx.y;
    int row = blockIdx.y * TILE_SIZE + ty;
    int col = blockIdx.x * TILE_SIZE + tx;
    
    float sum = 0.0f;
    
    // Loop over tiles
    for (int t = 0; t < (K + TILE_SIZE - 1) / TILE_SIZE; t++) {
        // Load tiles into shared memory
        if (row < M && (t * TILE_SIZE + tx) < K)
            tileA[ty][tx] = A[row * K + t * TILE_SIZE + tx];
        else
            tileA[ty][tx] = 0.0f;
            
        if (col < N && (t * TILE_SIZE + ty) < K)
            tileB[ty][tx] = B[(t * TILE_SIZE + ty) * N + col];
        else
            tileB[ty][tx] = 0.0f;
        
        __syncthreads();  // Wait for all threads to load
        
        // Compute partial dot product
        for (int k = 0; k < TILE_SIZE; k++) {
            sum += tileA[ty][k] * tileB[k][tx];
        }
        
        __syncthreads();  // Wait before loading next tile
    }
    
    // Write result
    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}


int main() {
    int M = 1024, K = 1024, N = 1024;
    
    // Allocate and initialize matrices...
    
    // Launch kernel
    dim3 blockDim(TILE_SIZE, TILE_SIZE);
    dim3 gridDim((N + TILE_SIZE - 1) / TILE_SIZE, 
                 (M + TILE_SIZE - 1) / TILE_SIZE);
    
    matrixMul<<<gridDim, blockDim>>>(d_A, d_B, d_C, M, K, N);
    
    return 0;
}

/* Without shared memory */
__global__ void matrixMulWithoutSharedMemory(float *A, float *B, float *C, int M, int K, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    float sum = 0.0f;
    for (int k = 0; k < K; k++) {
        sum += A[row * K + k] * B[k * N + col];
    }
    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}

extern "C" void solve(const float* A, const float* B, float* C, int M, int N, int K) {
    dim3 threadsPerBlock(16, 16);
    dim3 blocksPerGrid((K + threadsPerBlock.x - 1) / threadsPerBlock.x,
                       (M + threadsPerBlock.y - 1) / threadsPerBlock.y);
    
    matrix_multiplication_kernel<<<blocksPerGrid, threadsPerBlock>>>(A, B, C, M, N, K);
    cudaDeviceSynchronize();
}
```

### Example 3: Parallel Reduction (Sum)

```cuda
__global__ void reduce(float *input, float *output, int n) {
    __shared__ float sdata[256];
    
    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    
    // Load data into shared memory
    sdata[tid] = (i < n) ? input[i] : 0.0f;
    __syncthreads();
    
    // Reduction in shared memory
    for (int s = blockDim.x / 2; s > 0; s >>= 1) {
        if (tid < s) {
            sdata[tid] += sdata[tid + s];
        }
        __syncthreads();
    }
    
    // Write block result
    if (tid == 0) {
        output[blockIdx.x] = sdata[0];
    }
}
```

---

## Optimization Tips

### 1. Memory Access Patterns
```cuda
// ✓ GOOD: Coalesced access (consecutive threads → consecutive memory)
__global__ void coalesced(float *data) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    data[idx] = idx;  // Adjacent threads access adjacent elements
}

// ✗ BAD: Strided access
__global__ void strided(float *data, int stride) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    data[idx * stride] = idx;  // Poor memory performance
}
```

### 2. Shared Memory Usage
- Use shared memory for data reused within a block
- Faster than global memory (~100x)
- Always `__syncthreads()` after writing, before reading

### 3. Occupancy
- **Occupancy** = Active warps / Max possible warps
- Balance: threads per block, registers per thread, shared memory per block
- Common block sizes: 128, 256, 512 threads
- Must be multiple of 32 (warp size)

### 4. Minimize Host-Device Transfers
- PCIe bandwidth: ~16 GB/s
- GPU memory bandwidth: ~1000 GB/s
- Keep data on GPU as long as possible
- Use pinned memory (`cudaMallocHost`) for faster transfers

### 5. Avoid Warp Divergence
```cuda
// ✗ BAD: Divergent branches
if (threadIdx.x < 16) {
    // Half of warp does this
} else {
    // Other half does this
}

// ✓ BETTER: Minimize divergence
if (blockIdx.x < 16) {
    // Entire blocks diverge, not warps
}
```

### 6. Use Streams for Concurrency
```cuda
cudaStream_t stream1, stream2;
cudaStreamCreate(&stream1);
cudaStreamCreate(&stream2);

// Overlap kernel execution
kernel1<<<grid, block, 0, stream1>>>(args1);
kernel2<<<grid, block, 0, stream2>>>(args2);

cudaStreamDestroy(stream1);
cudaStreamDestroy(stream2);
```

### 7. Key Performance Metrics
- **Global memory bandwidth utilization**
- **Occupancy** (aim for >50%)
- **Warp execution efficiency** (minimize divergence)
- **Memory coalescing efficiency**

### 8. Profiling Tools
```bash
# NVIDIA profilers
nvprof ./program
nsys profile ./program
ncu ./program
```

---

## Quick Reference

### Common Block Sizes
- 1D: 128, 256, 512 threads
- 2D: 16×16 (256), 32×32 (1024)

### Memory Speed (Approximate)
- Registers: ~10,000 GB/s
- Shared Memory: ~1,500 GB/s
- L1/L2 Cache: ~800 GB/s
- Global Memory: ~900 GB/s
- Host-Device (PCIe): ~16 GB/s

### Maximum Limits (Typical GPU)
- Threads per block: 1024
- Blocks per grid: 2^31 - 1
- Shared memory per block: 48-164 KB
- Registers per block: 64K

### Error Checking Pattern
```c
CUDA_CHECK(cudaMalloc(&d_ptr, size));
CUDA_CHECK(cudaMemcpy(d_ptr, h_ptr, size, cudaMemcpyHostToDevice));
kernel<<<grid, block>>>(d_ptr);
CUDA_CHECK(cudaGetLastError());
CUDA_CHECK(cudaDeviceSynchronize());
```

---

## Resources

- [CUDA C Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
- [CUDA Best Practices](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)
- [CUDA Samples](https://github.com/NVIDIA/cuda-samples)
# Metal Programming Cheat Sheet

## Table of Contents
1. [Introduction to Metal](#introduction-to-metal)
2. [Program Flow](#program-flow)
3. [Thread & Memory Hierarchy](#thread--memory-hierarchy)
4. [Shader/Kernel Functions](#shaderkernel-functions)
5. [Essential Metal APIs](#essential-metal-apis)
6. [Code Examples](#code-examples)
7. [Optimization Tips](#optimization-tips)

---

## Introduction to Metal

**Metal** is Apple's low-level, high-performance graphics and compute API for iOS, macOS, tvOS, and visionOS. It provides near-direct access to the GPU, enabling high-performance graphics rendering and parallel computation.

### Key Features
- Low overhead API (closer to hardware than OpenGL/OpenCL)
- Unified graphics and compute pipeline
- Works on all Apple GPUs (A-series, M-series chips)
- Metal Shading Language (MSL) based on C++14
- Supports GPU-driven rendering and compute

### Metal vs CUDA
| Feature | Metal | CUDA |
|---------|-------|------|
| Platform | Apple devices only | NVIDIA GPUs |
| Language | Metal Shading Language (C++14) | CUDA C/C++ |
| API Type | Graphics + Compute | Compute-focused |
| Memory Model | Unified memory on Apple Silicon | Separate host/device memory |
| Ecosystem | Xcode, Metal Performance Shaders | nvcc, cuBLAS, cuDNN |

---

## Program Flow

Typical Metal compute program execution:

1. **Get GPU Device** - Access the Metal device (GPU)
2. **Create Command Queue** - Queue for submitting work to GPU
3. **Load Shader** - Compile Metal shader library
4. **Create Pipeline State** - Configure compute pipeline
5. **Allocate Buffers** - Create GPU buffers for data
6. **Encode Commands** - Record GPU commands
7. **Commit & Wait** - Execute and synchronize
8. **Read Results** - Access output data

### Complete Flow Example (Swift)

```swift
import Metal

// 1. Get GPU device
guard let device = MTLCreateSystemDefaultDevice() else {
    fatalError("Metal not supported")
}

// 2. Create command queue
guard let commandQueue = device.makeCommandQueue() else {
    fatalError("Could not create command queue")
}

// 3. Load shader library
guard let library = device.makeDefaultLibrary() else {
    fatalError("Could not load library")
}

guard let kernelFunction = library.makeFunction(name: "vectorAdd") else {
    fatalError("Could not find kernel function")
}

// 4. Create compute pipeline state
guard let pipelineState = try? device.makeComputePipelineState(function: kernelFunction) else {
    fatalError("Could not create pipeline state")
}

// 5. Allocate buffers
let count = 1000000
let bufferSize = count * MemoryLayout<Float>.stride

let bufferA = device.makeBuffer(length: bufferSize, options: .storageModeShared)!
let bufferB = device.makeBuffer(length: bufferSize, options: .storageModeShared)!
let bufferC = device.makeBuffer(length: bufferSize, options: .storageModeShared)!

// Initialize data
let ptrA = bufferA.contents().bindMemory(to: Float.self, capacity: count)
let ptrB = bufferB.contents().bindMemory(to: Float.self, capacity: count)
for i in 0..<count {
    ptrA[i] = Float(i)
    ptrB[i] = Float(i * 2)
}

// 6. Encode commands
guard let commandBuffer = commandQueue.makeCommandBuffer() else {
    fatalError("Could not create command buffer")
}

guard let computeEncoder = commandBuffer.makeComputeCommandEncoder() else {
    fatalError("Could not create compute encoder")
}

computeEncoder.setComputePipelineState(pipelineState)
computeEncoder.setBuffer(bufferA, offset: 0, index: 0)
computeEncoder.setBuffer(bufferB, offset: 0, index: 1)
computeEncoder.setBuffer(bufferC, offset: 0, index: 2)

// Calculate grid size
let threadsPerThreadgroup = MTLSize(width: 256, height: 1, depth: 1)
let threadgroupsPerGrid = MTLSize(
    width: (count + 255) / 256,
    height: 1,
    depth: 1
)

computeEncoder.dispatchThreadgroups(threadgroupsPerGrid, 
                                    threadsPerThreadgroup: threadsPerThreadgroup)
computeEncoder.endEncoding()

// 7. Commit and wait
commandBuffer.commit()
commandBuffer.waitUntilCompleted()

// 8. Read results
let ptrC = bufferC.contents().bindMemory(to: Float.self, capacity: count)
print("Result: \(ptrC[0]), \(ptrC[1]), \(ptrC[2])")
```

---

## Thread & Memory Hierarchy

### Thread Organization

**Grid → Threadgroups → Threads**

- **Grid**: Total execution space
- **Threadgroup**: Group of threads that can cooperate (like CUDA blocks)
- **Thread**: Individual execution unit (like CUDA threads)
- **SIMD Group**: 32 threads executing in lockstep (like CUDA warps)

### Thread Indexing

Metal provides built-in variables for indexing:

```metal
kernel void myKernel(
    // Thread position in grid (global ID)
    uint3 gid [[thread_position_in_grid]],
    
    // Thread position in threadgroup (local ID)
    uint3 tid [[thread_position_in_threadgroup]],
    
    // Threadgroup position in grid
    uint3 tgid [[threadgroup_position_in_grid]],
    
    // Threads per threadgroup
    uint3 tsize [[threads_per_threadgroup]],
    
    // Threadgroups per grid
    uint3 gsize [[threadgroups_per_grid]],
    
    // Thread index in SIMD group
    uint simd_lane_id [[thread_index_in_simdgroup]],
    
    // SIMD group index in threadgroup
    uint simd_group_id [[simdgroup_index_in_threadgroup]]
)
{
    // 1D global index
    uint index = gid.x;
    
    // 2D global index
    uint2 pos = gid.xy;
    uint idx = pos.y * width + pos.x;
}
```

### Memory Hierarchy

| Memory Type | Metal Keyword | Scope | Speed | Size | Usage |
|-------------|---------------|-------|-------|------|-------|
| **Device Memory** | `device` | All threads | Medium | GB | Main GPU memory |
| **Threadgroup Memory** | `threadgroup` | Threadgroup | Fast | 32-64KB | Shared within group |
| **Thread Memory** | `thread` | Single thread | Fastest | Limited | Local variables |
| **Constant Memory** | `constant` | All threads | Fast (cached) | 64KB | Read-only data |

**Memory Address Space Qualifiers:**

```metal
// Device memory (global memory)
device float* globalData

// Threadgroup memory (shared memory)
threadgroup float sharedData[256]

// Thread memory (private/register)
thread float localVar

// Constant memory (read-only)
constant float& constValue
```

### Apple Silicon Unified Memory

On Apple Silicon (M1/M2/M3), CPU and GPU share the same physical memory:
- No explicit CPU→GPU transfers needed
- Use `MTLStorageModeShared` for zero-copy access
- Faster than discrete GPU architectures

---

## Shader/Kernel Functions

### Kernel Definition

```metal
#include <metal_stdlib>
using namespace metal;

kernel void myKernel(
    device float* input [[buffer(0)]],
    device float* output [[buffer(1)]],
    constant uint& count [[buffer(2)]],
    uint gid [[thread_position_in_grid]]
)
{
    if (gid < count) {
        output[gid] = input[gid] * 2.0f;
    }
}
```

### Function Qualifiers

- `kernel` - Compute kernel (data-parallel function)
- `vertex` - Vertex shader function
- `fragment` - Fragment/pixel shader function

### Attribute Qualifiers

**Buffer Binding:**
```metal
device float* buffer [[buffer(0)]]      // Buffer at index 0
constant int& value [[buffer(1)]]       // Constant buffer at index 1
texture2d<float> tex [[texture(0)]]     // Texture at index 0
```

**Thread Position:**
```metal
[[thread_position_in_grid]]           // Global thread ID
[[thread_position_in_threadgroup]]    // Local thread ID
[[threadgroup_position_in_grid]]      // Block/group ID
[[threads_per_threadgroup]]           // Threads per group
```

### Dispatching Kernels

**Method 1: dispatchThreadgroups (like CUDA)**
```swift
// Specify threadgroups and threads per threadgroup
let threadsPerThreadgroup = MTLSize(width: 256, height: 1, depth: 1)
let threadgroupsPerGrid = MTLSize(width: (count + 255) / 256, height: 1, depth: 1)

encoder.dispatchThreadgroups(threadgroupsPerGrid, 
                             threadsPerThreadgroup: threadsPerThreadgroup)
```

**Method 2: dispatchThreads (simpler, Metal 2+)**
```swift
// Specify total threads directly (GPU calculates threadgroups)
let gridSize = MTLSize(width: count, height: 1, depth: 1)
let threadgroupSize = MTLSize(width: 256, height: 1, depth: 1)

encoder.dispatchThreads(gridSize, 
                       threadsPerThreadgroup: threadgroupSize)
```

---

## Essential Metal APIs

### Device & Command Queue

```swift
// Get default GPU
let device = MTLCreateSystemDefaultDevice()

// Create command queue (reuse across frames)
let commandQueue = device.makeCommandQueue()

// Get device info
print(device.name)
print(device.maxThreadsPerThreadgroup)
print(device.recommendedMaxWorkingSetSize)
```

### Library & Pipeline

```swift
// Load default library (shaders in project)
let library = device.makeDefaultLibrary()

// Load from file
let library = try device.makeLibrary(filepath: "path/to/shaders.metallib")

// Get function
let function = library.makeFunction(name: "kernelName")

// Create compute pipeline
let pipelineState = try device.makeComputePipelineState(function: function)

// Get pipeline info
let threadExecutionWidth = pipelineState.threadExecutionWidth  // SIMD width (32)
let maxTotalThreadsPerThreadgroup = pipelineState.maxTotalThreadsPerThreadgroup
```

### Buffers

```swift
// Allocate buffer
let buffer = device.makeBuffer(length: byteSize, options: .storageModeShared)

// Storage modes
// .storageModeShared - CPU & GPU accessible (unified memory)
// .storageModePrivate - GPU only (faster on discrete GPUs)
// .storageModeManaged - Synchronized CPU/GPU copies (macOS only)

// Access buffer data
let pointer = buffer.contents().bindMemory(to: Float.self, capacity: count)
pointer[0] = 1.0

// Create buffer with data
let data: [Float] = [1, 2, 3, 4]
let buffer = device.makeBuffer(bytes: data, 
                               length: data.count * MemoryLayout<Float>.stride,
                               options: .storageModeShared)
```

### Command Buffer & Encoder

```swift
// Create command buffer (one per frame/operation)
let commandBuffer = commandQueue.makeCommandBuffer()

// Create compute encoder
let encoder = commandBuffer.makeComputeCommandEncoder()

// Set pipeline
encoder.setComputePipelineState(pipelineState)

// Set buffers
encoder.setBuffer(inputBuffer, offset: 0, index: 0)
encoder.setBuffer(outputBuffer, offset: 0, index: 1)

// Set simple values
var count: UInt32 = 1000
encoder.setBytes(&count, length: MemoryLayout<UInt32>.size, index: 2)

// Dispatch
encoder.dispatchThreads(gridSize, threadsPerThreadgroup: threadgroupSize)

// End encoding
encoder.endEncoding()

// Commit and wait
commandBuffer.commit()
commandBuffer.waitUntilCompleted()

// Or async with completion handler
commandBuffer.addCompletedHandler { buffer in
    print("Completed with status: \(buffer.status)")
}
commandBuffer.commit()
```

### Synchronization

```swift
// Wait for completion (blocking)
commandBuffer.waitUntilCompleted()

// Async completion handler
commandBuffer.addCompletedHandler { buffer in
    // Called when GPU finishes
}

// Threadgroup barrier (in Metal shader)
threadgroup_barrier(mem_flags::mem_threadgroup)
```

---

## Code Examples

### Example 1: Vector Addition (Metal Shader)

```metal
#include <metal_stdlib>
using namespace metal;

kernel void vectorAdd(
    device const float* a [[buffer(0)]],
    device const float* b [[buffer(1)]],
    device float* c [[buffer(2)]],
    constant uint& count [[buffer(3)]],
    uint gid [[thread_position_in_grid]]
)
{
    if (gid < count) {
        c[gid] = a[gid] + b[gid];
    }
}
```

**Swift Host Code:**

```swift
import Metal

class VectorAddition {
    let device: MTLDevice
    let commandQueue: MTLCommandQueue
    let pipelineState: MTLComputePipelineState
    
    init() {
        device = MTLCreateSystemDefaultDevice()!
        commandQueue = device.makeCommandQueue()!
        
        let library = device.makeDefaultLibrary()!
        let function = library.makeFunction(name: "vectorAdd")!
        pipelineState = try! device.makeComputePipelineState(function: function)
    }
    
    func execute(a: [Float], b: [Float]) -> [Float] {
        let count = a.count
        let bufferSize = count * MemoryLayout<Float>.stride
        
        // Create buffers
        let bufferA = device.makeBuffer(bytes: a, length: bufferSize, 
                                       options: .storageModeShared)!
        let bufferB = device.makeBuffer(bytes: b, length: bufferSize,
                                       options: .storageModeShared)!
        let bufferC = device.makeBuffer(length: bufferSize,
                                       options: .storageModeShared)!
        
        // Create command buffer and encoder
        let commandBuffer = commandQueue.makeCommandBuffer()!
        let encoder = commandBuffer.makeComputeCommandEncoder()!
        
        encoder.setComputePipelineState(pipelineState)
        encoder.setBuffer(bufferA, offset: 0, index: 0)
        encoder.setBuffer(bufferB, offset: 0, index: 1)
        encoder.setBuffer(bufferC, offset: 0, index: 2)
        
        var countValue = UInt32(count)
        encoder.setBytes(&countValue, length: MemoryLayout<UInt32>.size, index: 3)
        
        // Dispatch
        let gridSize = MTLSize(width: count, height: 1, depth: 1)
        let threadgroupSize = MTLSize(width: 256, height: 1, depth: 1)
        encoder.dispatchThreads(gridSize, threadsPerThreadgroup: threadgroupSize)
        
        encoder.endEncoding()
        commandBuffer.commit()
        commandBuffer.waitUntilCompleted()
        
        // Read results
        let resultPtr = bufferC.contents().bindMemory(to: Float.self, capacity: count)
        return Array(UnsafeBufferPointer(start: resultPtr, count: count))
    }
}
```

### Example 2: Matrix Multiplication with Threadgroup Memory

```metal
#include <metal_stdlib>
using namespace metal;

#define TILE_SIZE 16

kernel void matrixMul(
    device const float* A [[buffer(0)]],
    device const float* B [[buffer(1)]],
    device float* C [[buffer(2)]],
    constant uint& M [[buffer(3)]],
    constant uint& K [[buffer(4)]],
    constant uint& N [[buffer(5)]],
    uint2 gid [[thread_position_in_grid]],
    uint2 tid [[thread_position_in_threadgroup]]
)
{
    // Threadgroup memory (shared memory)
    threadgroup float tileA[TILE_SIZE][TILE_SIZE];
    threadgroup float tileB[TILE_SIZE][TILE_SIZE];
    
    uint row = gid.y;
    uint col = gid.x;
    
    float sum = 0.0f;
    
    // Loop over tiles
    uint numTiles = (K + TILE_SIZE - 1) / TILE_SIZE;
    
    for (uint t = 0; t < numTiles; t++) {
        // Load tile from A
        uint aCol = t * TILE_SIZE + tid.x;
        if (row < M && aCol < K) {
            tileA[tid.y][tid.x] = A[row * K + aCol];
        } else {
            tileA[tid.y][tid.x] = 0.0f;
        }
        
        // Load tile from B
        uint bRow = t * TILE_SIZE + tid.y;
        if (col < N && bRow < K) {
            tileB[tid.y][tid.x] = B[bRow * N + col];
        } else {
            tileB[tid.y][tid.x] = 0.0f;
        }
        
        // Synchronize threadgroup
        threadgroup_barrier(mem_flags::mem_threadgroup);
        
        // Compute partial dot product
        for (uint k = 0; k < TILE_SIZE; k++) {
            sum += tileA[tid.y][k] * tileB[k][tid.x];
        }
        
        // Synchronize before next tile
        threadgroup_barrier(mem_flags::mem_threadgroup);
    }
    
    // Write result
    if (row < M && col < N) {
        C[row * N + col] = sum;
    }
}
```

### Example 3: Parallel Reduction (Sum)

```metal
#include <metal_stdlib>
using namespace metal;

kernel void parallelSum(
    device const float* input [[buffer(0)]],
    device float* output [[buffer(1)]],
    constant uint& count [[buffer(2)]],
    uint gid [[thread_position_in_grid]],
    uint tid [[thread_position_in_threadgroup]],
    uint tgid [[threadgroup_position_in_grid]],
    uint tsize [[threads_per_threadgroup]]
)
{
    threadgroup float shared[256];
    
    // Load data into threadgroup memory
    shared[tid] = (gid < count) ? input[gid] : 0.0f;
    threadgroup_barrier(mem_flags::mem_threadgroup);
    
    // Parallel reduction
    for (uint stride = tsize / 2; stride > 0; stride >>= 1) {
        if (tid < stride) {
            shared[tid] += shared[tid + stride];
        }
        threadgroup_barrier(mem_flags::mem_threadgroup);
    }
    
    // Write result from first thread
    if (tid == 0) {
        output[tgid] = shared[0];
    }
}
```

### Example 4: Image Processing (Gaussian Blur)

```metal
#include <metal_stdlib>
using namespace metal;

kernel void gaussianBlur(
    texture2d<float, access::read> inTexture [[texture(0)]],
    texture2d<float, access::write> outTexture [[texture(1)]],
    uint2 gid [[thread_position_in_grid]]
)
{
    if (gid.x >= outTexture.get_width() || gid.y >= outTexture.get_height()) {
        return;
    }
    
    // 3x3 Gaussian kernel
    const float kernel[3][3] = {
        {1.0/16, 2.0/16, 1.0/16},
        {2.0/16, 4.0/16, 2.0/16},
        {1.0/16, 2.0/16, 1.0/16}
    };
    
    float4 sum = float4(0.0);
    
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            uint2 samplePos = uint2(int2(gid) + int2(dx, dy));
            float4 color = inTexture.read(samplePos);
            sum += color * kernel[dy + 1][dx + 1];
        }
    }
    
    outTexture.write(sum, gid);
}
```

---

## Optimization Tips

### 1. Memory Access Patterns

```metal
// ✓ GOOD: Coalesced access
kernel void coalesced(
    device float* data [[buffer(0)]],
    uint gid [[thread_position_in_grid]])
{
    data[gid] = gid;  // Adjacent threads access adjacent memory
}

// ✗ BAD: Strided access
kernel void strided(
    device float* data [[buffer(0)]],
    constant uint& stride [[buffer(1)]],
    uint gid [[thread_position_in_grid]])
{
    data[gid * stride] = gid;  // Poor performance
}
```

### 2. Use Threadgroup Memory

```metal
// Use threadgroup memory for data reused within group
kernel void optimized(
    device const float* input [[buffer(0)]],
    device float* output [[buffer(1)]],
    uint gid [[thread_position_in_grid]],
    uint tid [[thread_position_in_threadgroup]])
{
    threadgroup float cache[256];
    
    // Load once into fast threadgroup memory
    cache[tid] = input[gid];
    threadgroup_barrier(mem_flags::mem_threadgroup);
    
    // Reuse from fast memory
    float value = cache[tid] + cache[(tid + 1) % 256];
    output[gid] = value;
}
```

### 3. Optimal Threadgroup Sizes

```swift
// Get optimal size from pipeline
let threadExecutionWidth = pipelineState.threadExecutionWidth  // Typically 32
let maxThreads = pipelineState.maxTotalThreadsPerThreadgroup   // Typically 1024

// Use multiples of SIMD width (32)
let threadgroupSize = MTLSize(width: 256, height: 1, depth: 1)  // Good
// let threadgroupSize = MTLSize(width: 100, height: 1, depth: 1)  // Bad
```

### 4. Minimize CPU-GPU Synchronization

```swift
// ✗ BAD: Synchronize every frame
for i in 0..<1000 {
    let commandBuffer = commandQueue.makeCommandBuffer()!
    // ... encode work ...
    commandBuffer.commit()
    commandBuffer.waitUntilCompleted()  // Blocks CPU!
}

// ✓ GOOD: Batch work
let commandBuffer = commandQueue.makeCommandBuffer()!
for i in 0..<1000 {
    // ... encode all work ...
}
commandBuffer.commit()
commandBuffer.waitUntilCompleted()  // Single sync
```

### 5. Use Appropriate Storage Modes

```swift
// Apple Silicon (unified memory)
let buffer = device.makeBuffer(length: size, options: .storageModeShared)

// Discrete GPU (macOS with AMD/NVIDIA)
let buffer = device.makeBuffer(length: size, options: .storageModePrivate)
```

### 6. Leverage SIMD Operations

```metal
// Use SIMD types for vectorization
kernel void simdOps(
    device float4* data [[buffer(0)]],
    uint gid [[thread_position_in_grid]])
{
    float4 value = data[gid];
    value = value * 2.0f + float4(1.0f);  // Vectorized
    data[gid] = value;
}
```

### 7. Avoid Threadgroup Divergence

```metal
// ✗ BAD: Divergent branches within SIMD group
if (tid % 2 == 0) {
    // Half of threads do this
} else {
    // Other half do this
}

// ✓ BETTER: Full SIMD groups take same path
if (tid < 16) {
    // First SIMD group
} else {
    // Second SIMD group
}
```

### 8. Use Metal Performance Shaders (MPS)

For common operations, use optimized MPS kernels:

```swift
import MetalPerformanceShaders

// Optimized matrix multiplication
let matrixMul = MPSMatrixMultiplication(
    device: device,
    transposeLeft: false,
    transposeRight: false,
    resultRows: M,
    resultColumns: N,
    interiorColumns: K,
    alpha: 1.0,
    beta: 0.0
)

matrixMul.encode(commandBuffer: commandBuffer,
                leftMatrix: matrixA,
                rightMatrix: matrixB,
                resultMatrix: matrixC)
```

---

## Quick Reference

### Common Threadgroup Sizes
- 1D: 64, 128, 256, 512 threads
- 2D: 8×8, 16×16, 32×32
- Must be multiple of 32 (SIMD width)

### Memory Speed (Approximate)
- Registers/Thread memory: ~10,000 GB/s
- Threadgroup memory: ~1,000 GB/s
- Device memory: ~400 GB/s (varies by chip)
- Unified memory (Apple Silicon): Zero-copy access

### Maximum Limits (Apple Silicon)
- Threads per threadgroup: 1024
- Threadgroup memory: 32-64 KB
- Buffer size: Limited by system RAM
- SIMD width: 32 threads

### Storage Modes
```swift
.storageModeShared    // CPU & GPU access (unified memory)
.storageModePrivate   // GPU only (discrete GPUs)
.storageModeManaged   // Synced CPU/GPU (macOS discrete)
```

### Error Checking Pattern

```swift
guard let device = MTLCreateSystemDefaultDevice() else {
    fatalError("Metal not supported")
}

guard let commandQueue = device.makeCommandQueue() else {
    fatalError("Failed to create command queue")
}

// Check command buffer status
commandBuffer.addCompletedHandler { buffer in
    if buffer.status == .error {
        print("Error: \(buffer.error?.localizedDescription ?? "unknown")")
    }
}
```

### Profiling Tools
- **Xcode GPU Frame Capture**: Capture and analyze GPU workload
- **Instruments (Metal System Trace)**: Profile GPU performance
- **Metal Debugger**: Debug shaders and pipeline state

---

## Metal vs CUDA Quick Comparison

| Concept | CUDA | Metal |
|---------|------|-------|
| **Thread** | Thread | Thread |
| **Block** | Block | Threadgroup |
| **Grid** | Grid | Grid |
| **Warp** | Warp (32 threads) | SIMD Group (32 threads) |
| **Shared Memory** | `__shared__` | `threadgroup` |
| **Global Memory** | `__global__` / `__device__` | `device` |
| **Sync Threads** | `__syncthreads()` | `threadgroup_barrier()` |
| **Thread Index** | `threadIdx.x` | `[[thread_position_in_threadgroup]]` |
| **Block Index** | `blockIdx.x` | `[[threadgroup_position_in_grid]]` |
| **Global Index** | Calculate manually | `[[thread_position_in_grid]]` |
| **Kernel Launch** | `kernel<<<grid, block>>>()` | `encoder.dispatchThreads()` |

---

## Resources

- [Metal Programming Guide](https://developer.apple.com/metal/)
- [Metal Shading Language Specification](https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf)
- [Metal Best Practices Guide](https://developer.apple.com/documentation/metal/best_practices)
- [Metal Performance Shaders](https://developer.apple.com/documentation/metalperformanceshaders)
- [WWDC Metal Sessions](https://developer.apple.com/videos/graphics-and-games/metal)
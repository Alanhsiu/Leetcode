## 💾 Shortest Path Algorithms Cheat Sheet (Interview Prep)

| Algorithm | Type | Edge Weight Constraint | Time Complexity (Best Case) | Key C++ Implementation Detail |
| :--- | :--- | :--- | :--- | :--- |
| **Dijkstra's** | Single-Source (SSSP) | **Non-Negative** ($\ge 0$) | $O((V+E) \log V)$ (using Min-Heap) | `std::priority_queue` for greedy relaxation. |
| **Bellman-Ford** | Single-Source (SSSP) | Allows **Negative Weights**, but **NO Negative Cycles** | $O(V \cdot E)$ | Outer loop iterates $V-1$ times; checks for negative cycles on $V$-th iteration. |
| **Floyd-Warshall**| All-Pairs (APSP) | Allows **Negative Weights**, but **NO Negative Cycles** | $O(V^3)$ | Three nested loops ($k, i, j$); DP approach using intermediate nodes. |

```cpp
#include <vector>
#include <queue>
#include <limits>
#include <algorithm>

using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        
        // Use a large number for infinity
        const int INF = numeric_limits<int>::max();
        
        // 1. Build Adjacency List: adj[u] = {v, w}
        // Nodes are 1-indexed, use n+1 size
        vector<pair<int, int>> adj[n + 1];
        for (const auto& time : times) {
            int u = time[0];
            int v = time[1];
            int w = time[2];
            adj[u].push_back({v, w});
        }
        
        // 2. Initialize Distance Array and Priority Queue
        vector<int> dist(n + 1, INF);
        
        // Min-Heap: {time, node}
        // std::greater ensures the smallest time is at the top
        using P = pair<int, int>;
        priority_queue<P, vector<P>, greater<P>> pq;

        // Source initialization
        dist[k] = 0;
        pq.push({0, k}); 
        
        // 3. Dijkstra's Algorithm
        while (!pq.empty()) {
            int time_u = pq.top().first;
            int u = pq.top().second;
            pq.pop();

            // Skip if a shorter path to u has already been found
            if (time_u > dist[u]) {
                continue;
            }

            // Relaxation step
            for (const auto& edge : adj[u]) {
                int v = edge.first;
                int weight_uv = edge.second;
                
                int new_time = dist[u] + weight_uv;
                
                if (new_time < dist[v]) {
                    // Update distance and push to priority queue
                    dist[v] = new_time;
                    pq.push({new_time, v});
                }
            }
        }
        
        // 4. Determine result
        int max_time = 0;
        
        // Check nodes 1 through n
        for (int i = 1; i <= n; ++i) {
            // If any node is unreachable
            if (dist[i] == INF) {
                return -1;
            }
            // Find the maximum time among all shortest paths
            max_time = max(max_time, dist[i]);
        }
        
        return max_time;
    }
};

// Time: O((V+E)logV)
// Space: O(V+E)
```
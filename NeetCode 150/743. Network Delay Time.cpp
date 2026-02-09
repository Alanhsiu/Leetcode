#include <vector>
#include <queue>
// #include <climits>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        // Dijkstra: single source
        // keep adding the min time edge to our graph
        // to achieve this, we need to maintain a pq
        // time: O(ElogV)
        // space: O(V+E)

        // init adj list
        vector<vector<pair<int, int>>> adj(n+1);
        for(const auto& t: times){
            adj[t[0]].push_back({t[1], t[2]}); // key is the source node
        }
        
        // init dist
        vector<int> dist(n+1, INT_MAX);
        dist[k]=0;

        // init pq, it stores {w, u}
        std::priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq; // min_heap
        pq.push({0, k});

        // do Dijkstra's Algo
        while(!pq.empty()){
            const auto [d, u]=pq.top();
            pq.pop();

            if(d>dist[u]){
                continue;
            }

            for(const auto& edge: adj[u]){
                int v=edge.first;
                int w=edge.second;

                if(dist[v]>dist[u]+w){
                    dist[v]=dist[u]+w;
                    pq.push({dist[v], v});
                }
            }
        }

        int maxDist=INT_MIN;
        for(int i=1; i<=n; ++i){
            if(dist[i]==INT_MAX){
                return -1;
            }
            maxDist=std::max(maxDist, dist[i]);
        }

        return maxDist;
    }
};

// Time: O(ElogV) or O(ElogE) since E can be at most V^2, O(ElogV^2) = O(2ElogV) = O(ElogV)
// Space: O(V+E) for the adjacency list and distance array
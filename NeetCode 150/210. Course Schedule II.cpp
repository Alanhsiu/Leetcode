#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        // topological sort
        // 1. create adj list
        // 2. start from those inDegree=0, do bfs

        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        vector<int> res;

        for(const auto& p: prerequisites){
            adj[p[1]].push_back(p[0]); // pre: [nexts]
            ++inDegree[p[0]];
        }


        queue<int> q; // record all inDegree=0
        for(int i=0; i<numCourses; ++i){
            if(inDegree[i]==0){
                q.push(i);
            }
        }

        while(!q.empty()){
            int qlen=q.size();

            for(int i=0; i<qlen; ++i){
                int cur=q.front();
                q.pop();
                res.push_back(cur);

                for(const int v: adj[cur]){
                    --inDegree[v];
                    if(inDegree[v]==0){
                        q.push(v);
                    }
                }
            }
        }

        return res.size()==numCourses?res:vector<int>{};
    }
};

// Time: O(V+E) where V is the number of courses and E is the number of prerequisites
// Space: O(V+E) for the adjacency list and inDegree array
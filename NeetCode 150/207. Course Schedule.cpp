#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // topological sort
        // 1. create adj list
        // 2. start from indegree=0, check if I can go through all the courses

        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);

        for(const auto& p: prerequisites){
            // [course, its prereq]
            adj[p[1]].push_back(p[0]); // take i first, so that we can consider adj[i]
            ++inDegree[p[0]];
        }

        queue<int> q; // record those courses with inDegree=0
        for(int i=0; i<numCourses; ++i){
            if(inDegree[i]==0){
                q.push(i);
            }
        }

        int count=0;

        while(!q.empty()){
            int qlen=q.size();
            count+=qlen;

            for(int i=0; i<qlen; ++i){
                int cur=q.front();
                q.pop();
                for(const int v: adj[cur]){ // vertex in adj[cur]
                    --inDegree[v];
                    if(inDegree[v]==0){
                        q.push(v);
                    }
                }
            }
        }

        return count==numCourses;
    }
};

// Time: O(V+E) where V is the number of courses and E is the number of prerequisites
// Space: O(V+E) for the adjacency list and inDegree array
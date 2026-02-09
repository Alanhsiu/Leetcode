#include <vector>
using namespace std;

class Solution {
public:
    
    // int dfs(vector<vector<int>>& adj, vector<vector<int>>& memo, int s, int t){ // s: source, t: destination
    bool dfs(vector<vector<int>>& adj, vector<bool>& visited, int s, int t){ // s: source, t: destination
        if(s==t){
            return true;
        }
        // if(memo[s][t]!=-1){
        //     return memo[s][t];
        // }
        // for(const int next: adj[s]){
        //     if(dfs(adj, memo, next, t)==1){
        //         memo[next][t]=1;
        //         return 1;
        //     }
        // }

        // memo[s][t]=0;
        // return 0;

        visited[s]=true;
        for(const int next: adj[s]){
            if(!visited[next]){
                if(dfs(adj, visited, next, t)){
                    return true;
                }
            }
        }

        return false;
    }
    
    vector<bool> checkIfPrerequisite(int numCourses, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
        vector<vector<int>> adj(numCourses);
        for(const auto& p: prerequisites){
            adj[p[0]].push_back(p[1]);
        }

        vector<bool> res;
        // vector<vector<int>> memo(numCourses, vector<int>(numCourses, -1)); // -1: not visited yet, 0: not reachable, 1: reachable
        vector<bool> visited(numCourses, false);
        for(const auto& q: queries){
            // res.push_back(dfs(adj, memo, q[0], q[1])==1);

            vector<bool> visited(numCourses, false);
            res.push_back(dfs(adj, visited, q[0], q[1]));
        }
        return res;
    }


/*
    vector<bool> checkIfPrerequisite(int numCourses, vector<vector<int>>& prerequisites, vector<vector<int>>& queries) {
        // topological sort (Q is large)
        // 1. create adj list, inDegree
        // 2. for each inDegree, do bfs, update table
        // time: O(E*V)
        // space: O(V*V)

        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);

        for(const auto& p: prerequisites){
            adj[p[0]].push_back(p[1]);
            ++inDegree[p[1]];
        }

        queue<int> q;
        vector<bool> res;
        vector<vector<int>> table(numCourses, vector<int>(numCourses, false));
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

                for(const int v: adj[cur]){
                    table[cur][v]=true;
                    // update table
                    for(int j=0; j<numCourses; ++j){
                        if(table[j][cur]){
                            table[j][v]=true;
                        }
                    }
                    --inDegree[v];
                    if(inDegree[v]==0){
                        q.push(v);
                    }
                }
            }
        }

        for(const auto& q: queries){
            res.push_back(table[q[0]][q[1]]);
        }

        return res;
    }
*/
};

// for DFS
// Time: O((V+E)*Q) where Q is the number of queries, V is the number of courses, and E is the number of prerequisites
// Space: O(V+E) for the adjacency list and O(V^2) for the memoization table

// for DFS with memoization
// Time: O(V*E+Q)
// Space: O(V*V) for the memoization table

// for topological sort
// Time: O(V*E+Q)
// Space: O(V*V) for the table and O(V+E) for the adjacency list and inDegree array
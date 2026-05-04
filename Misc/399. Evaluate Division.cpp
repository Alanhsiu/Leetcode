#include <unordered_map>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    vector<double> calcEquation(vector<vector<string>>& equations, vector<double>& values, vector<vector<string>>& queries) {
        unordered_map<string, unordered_map<string, double>> g;
        // build the graph
        int n=equations.size();
        for(int i=0; i<n; ++i){
            string a=equations[i][0];
            string b=equations[i][1];
            double val=values[i];
            g[a][b]=val;
            g[b][a]=1/val;
        }

        // do bfs
        vector<double> res;
        for(const auto& query: queries){
            string a=query[0];
            string b=query[1];
            if(!g.count(a) || !g.count(b)){
                res.push_back(-1.0);
                continue;
            }
            // find a path from a to b
            unordered_set<string> visited;
            queue<pair<string, double>> q;
            q.push({a, 1.0});
            visited.insert(a);
            bool found=false;
            double ans=-1.0;
            
            while(!q.empty()){
                auto [u, prod]=q.front();
                q.pop();
                if(u==b){
                    found=true;
                    ans=prod;
                }
                for(const auto& [node, weight]: g[u]){
                    if(!visited.count(node)){
                        q.push({node, weight*prod});
                        visited.insert(u);
                    }
                }
            }

            res.push_back(ans);
        }

        return res;
    }
};

// Time Complexity: O(Q*(V+E)), where Q is the number of queries, V is the number of variables, and E is the number of equations.
// Space Complexity: O(V+E) for the graph, O(V) for the visited set, and O(Q) for the result vector.
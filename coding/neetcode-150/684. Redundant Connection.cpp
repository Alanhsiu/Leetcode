class Solution {
public:
    int find(vector<int>& parents, int idx){
        if(parents[idx]==idx){
            return idx;
        }
        return parents[idx]=find(parents, parents[idx]);
    }
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n=edges.size();
        vector<int> parents(n+1);
        vector<int> ranks(n+1, 1);

        for(int i=1; i<=n; ++i){
            parents[i]=i;
        }

        for(const auto& e: edges){
            // find parents
            int a=e[0];
            int b=e[1];

            int pa=find(parents, a);
            int pb=find(parents, b);

            // if same: return this edge
            if(pa==pb){
                return e;
            }
            // if not same: join
            if(ranks[pa]>ranks[pb]){
                parents[pb]=pa;
            }
            else if(ranks[pb]>ranks[pa]){
                parents[pa]=pb;
            }
            else{ // rank: pa==pb
                parents[pb]=pa;
                ++ranks[pa];
            }
            
        }

        return {};
    }
};

// Time Complexity: O(N * α(N)), where α is the Inverse Ackermann function, can be considered nearly constant.
// Space Complexity: O(N)
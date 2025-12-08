class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> res(n, 1);
        for(int row=1; row<m; ++row){
            for(int col=1; col<n; ++col){
                res[col]+=res[col-1];
            }
        }

        return res[n-1];
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(N)
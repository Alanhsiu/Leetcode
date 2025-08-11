#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int m=matrix.size();
        int n=matrix[0].size();
        int maxEdge=0;
        vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

        for(int i=1; i<m+1; ++i){
            for(int j=1; j<n+1; ++j){
                if(matrix[i-1][j-1]=='1'){
                    dp[i][j]=min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]})+1;
                    maxEdge=max(maxEdge, dp[i][j]);
                }
            }
        }

        return maxEdge*maxEdge;
    }
};

// Time Complexity: O(M*N), where M is the number of rows and N is the number of columns in the matrix.
// Space Complexity: O(M*N) for the dp array.
// The space can be optimized to O(N) by using only two rows, but here we use O(M*N) for clarity.
// The result is the area of the largest square found, which is maxEdge squared.
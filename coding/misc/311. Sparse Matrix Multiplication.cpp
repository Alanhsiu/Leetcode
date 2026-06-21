#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> multiply(vector<vector<int>>& mat1, vector<vector<int>>& mat2) {
        int m=mat1.size();
        int k=mat1[0].size();
        int n=mat2[0].size();

        vector<vector<int>> res(m, vector<int>(n, 0));
        for(int i=0; i<m; ++i){
            for(int j=0; j<k; ++j){
                if(mat1[i][j]==0){
                    continue;
                }
                for(int l=0; l<n; ++l){
                    if(mat2[j][l]==0){
                        continue;
                    }
                    res[i][l]+=mat1[i][j]*mat2[j][l];
                }
            }
        }

        return res;
    }
};

// m*k, k*n
// for each element, we do k multiplication
// m*n elements, so m*n*k multiplication

// Time Complexity: O(m*n*k), where m, n, and k are the dimensions of the input matrices.
// Space Complexity: O(m*n) for the result matrix.
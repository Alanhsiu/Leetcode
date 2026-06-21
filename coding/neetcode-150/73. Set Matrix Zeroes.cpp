class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size();
        int n=matrix[0].size();

        vector<bool> row(m, false);
        vector<bool> col(n, false);

        for(int i=0; i<m; ++i){ // O(mn)
            for(int j=0; j<n; ++j){
                if(matrix[i][j]==0){
                    row[i]=true;
                    col[j]=true;
                }
            }
        }

        for(int i=0; i<m; ++i){ // O(mn)
            if(row[i]){
                for(int j=0; j<n; ++j){
                    matrix[i][j]=0;
                }
            }
        }

        for(int j=0; j<n; ++j){ // O(mn)
            if(col[j]){
                for(int i=0; i<m; ++i){
                    matrix[i][j]=0;
                }
            }
        }

    }
};

// Time Complexity: O(mn)
// Space Complexity: O(m+n), can be optimized to O(1) by using the first row and first column to store the information.
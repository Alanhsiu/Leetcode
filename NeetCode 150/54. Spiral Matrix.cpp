class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;

        int m=matrix.size(); // 3
        int n=matrix[0].size(); // 4

        // loop 0: (0, 0) -> (0, n-1) -> (m-1, n-1) -> (m-1, 0) -> (1, 0)
        // loop 1: (1, 1) -> (1, n-2) -> (m-2, n-2) -> (m-2, 1) -> (2, 1)
        // loop 2: (2, 2) -> ...

        int totLoop=std::min(m, n)/2;
        int curLoop=0;

        while(curLoop<totLoop){

            // first row
            for(int j=curLoop; j<=n-1-curLoop; ++j){
                res.push_back(matrix[curLoop][j]);
            }
            // last col
            for(int i=curLoop+1; i<=m-1-curLoop; ++i){
                res.push_back(matrix[i][n-1-curLoop]);
            }
            // last row
            for(int j=n-2-curLoop; j>=curLoop; --j){
                res.push_back(matrix[m-1-curLoop][j]);
            }
            // first col
            for(int i=m-2-curLoop; i>curLoop; --i){
                res.push_back(matrix[i][curLoop]);
            }

            ++curLoop;
        }

        if(std::min(m, n)%2==1){
            if(m<=n){
                for(int j=curLoop; j<=n-1-curLoop; ++j){
                    res.push_back(matrix[curLoop][j]);
                }
            }
            else{
                for(int i=curLoop; i<=m-1-curLoop; ++i){
                    res.push_back(matrix[i][curLoop]);
                }
            }
        }

        return res;
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(1)
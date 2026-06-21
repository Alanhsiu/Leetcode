class Solution {
public:

    void dfs(vector<string>& cur, int n, int curQNum){ // curQNum means current row
        if(curQNum==n){
            res.push_back(cur);
            return;
        }
        for(int col=0; col<n; ++col){
            if(!cols[col] && !diag1[curQNum+col] && !diag2[curQNum-col+n-1]){
                cur[curQNum][col]='Q';
                cols[col]=true;
                diag1[curQNum+col]=true;
                diag2[curQNum-col+n-1]=true;

                dfs(cur, n, curQNum+1);
                
                cols[col]=false;
                cur[curQNum][col]='.';
                diag1[curQNum+col]=false;
                diag2[curQNum-col+n-1]=false;
            }
        }
    }

    vector<vector<string>> solveNQueens(int n) {
        vector<string> cur(n, string(n, '.'));
        cols.assign(n, false);
        diag1.assign(2*n-1, false);
        diag2.assign(2*n-1, false);
        dfs(cur, n, 0);
        return res;
    }

    vector<vector<string>> res;
    vector<bool> cols;
    vector<bool> diag1; // 0~2n-2
    vector<bool> diag2; // -(n-1)~(n-1) --> 0~2n-2
};

// Time Complexity: O(N!)
// Space Complexity: O(N)
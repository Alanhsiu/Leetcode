class Solution {
public:
    void solve(vector<vector<char>>& board) {
        const int m=board.size();
        const int n=board[0].size();

        queue<pair<int, int>> q;
        
        for(int j=0; j<n; ++j){
            if(board[0][j]=='O'){
                q.push({0, j});
                board[0][j]='#';
            }
            if(board[m-1][j]=='O'){
                q.push({m-1, j});
                board[m-1][j]='#';
            }
        }
        for(int i=1; i<m-1; ++i){
            if(board[i][0]=='O'){
                q.push({i, 0});
                board[i][0]='#';
            }
            if(board[i][n-1]=='O'){
                q.push({i, n-1});
                board[i][n-1]='#';
            }
        }

        const int dirs[4][2]={{-1,0}, {1,0}, {0,-1}, {0,1}};

        while(!q.empty()){
            auto [x, y]=q.front();
            q.pop();

            for(auto& d: dirs){
                int nx=x+d[0];
                int ny=y+d[1];
                if(nx>0 && nx<m-1 && ny>0 && ny<n-1 && board[nx][ny]=='O'){
                    board[nx][ny]='#';
                    q.push({nx, ny});
                }
            }

        }

        for(auto& row: board){
            for(char& c: row){
                if(c=='#'){
                    c='O';
                }
                else if(c=='O'){
                    c='X';
                }
            }
        }
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(M*N)

class Solution {
public:
    // void dfs(vector<vector<int>>& grid, int& curArea, int x, int y){
    //     if(x<0 || x>=grid.size() || y<0 || y>=grid[0].size() || grid[x][y]==0){
    //         return;
    //     }
    //     ++curArea;
    //     grid[x][y]=0;


    //     for(int i=0; i<4; ++i){
    //         dfs(grid, curArea, x+dx[i], y+dy[i]);
    //     }
    // }
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int maxArea=0;
        queue<pair<int, int>> q;

        const int dx[4]={-1, 1, 0, 0};
        const int dy[4]={0, 0, -1, 1};

        for(int i=0; i<grid.size(); ++i){
            for(int j=0; j<grid[0].size(); ++j){
                if(grid[i][j]==1){
                    int curArea=0;
                    // bfs
                    q.push({i, j});
                    grid[i][j]=0;
                    while(!q.empty()){
                        int curLen=q.size();
                        for(int i=0; i<curLen; ++i){
                            auto [x, y]=q.front();
                            q.pop();
                            ++curArea;
                            for(int k=0; k<4; ++k){
                                int nx=x+dx[k];
                                int ny=y+dy[k];
                                if(nx<0 || nx>=grid.size() || ny<0 || ny>=grid[0].size() || grid[nx][ny]==0){
                                    continue;
                                }
                                q.push({nx, ny});
                                grid[nx][ny]=0;
                            }
                        }
                    }
                    maxArea=max(maxArea, curArea);
                }
            }
        }

        return maxArea;
    }
};

// Time Complexity: O(M * N), where M is the number of rows and N is the number of columns in the grid. Each cell is processed at most once.
// Space Complexity: O(min(M, N)) in the case of BFS, which is the size of the queue. In the worst case, the queue can grow to the size of the smaller dimension of the grid.
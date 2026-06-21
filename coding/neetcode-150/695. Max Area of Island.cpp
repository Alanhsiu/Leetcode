#include <vector>
#include <queue>
using namespace std;

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
        int m=grid.size();
        int n=grid[0].size();

        int maxArea=0;
        queue<pair<int, int>> q;

        const int dx[4]={-1, 1, 0, 0};
        const int dy[4]={0, 0, -1, 1};

        for(int i=0; i<m; ++i){
            for(int j=0; j<n; ++j){
                if(grid[i][j]==1){
                    int curArea=0;
                    // bfs
                    q.push({i, j});
                    grid[i][j]=0;
                    while(!q.empty()){
                        // int curLen=q.size();
                        // for(int i=0; i<curLen; ++i){
                            auto [x, y]=q.front();
                            q.pop();
                            ++curArea;
                            for(int k=0; k<4; ++k){
                                int nx=x+dx[k];
                                int ny=y+dy[k];
                                if(nx<0 || nx>=m || ny<0 || ny>=n || grid[nx][ny]==0){
                                    continue;
                                }
                                q.push({nx, ny});
                                grid[nx][ny]=0;
                            }
                        // }
                    }
                    maxArea=max(maxArea, curArea);
                }
            }
        }

        return maxArea;
    }
};
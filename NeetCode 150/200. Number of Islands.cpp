#include <vector>
using namespace std;

class Solution {
public:
    const int dx[4]={-1, 1, 0, 0};
    const int dy[4]={0, 0, -1, 1};
    
    void dfs(vector<vector<char>>& grid, int x, int y){
        int m=grid.size();
        int n=grid[0].size();


        grid[x][y]='0';

        for(int k=0; k<4; ++k){
            int nx=x+dx[k];
            int ny=y+dy[k];

            if(nx>=0 && nx<m && ny>=0 && ny<n && grid[nx][ny]=='1'){
                dfs(grid, nx, ny);
            }
        }
    }
    int numIslands(vector<vector<char>>& grid) {
        // BFS: O(MN), O(min(M, N))
        // DFS: O(MN), O(MN)
        // Union Find: O(MN.alpha(MN)), O(MN)

        int m=grid.size();
        int n=grid[0].size();
        int count=0;

        for(int i=0; i<m; ++i){
            for(int j=0; j<n; ++j){
                if(grid[i][j]=='1'){
                    ++count;
                    dfs(grid, i, j);
                }
            }
        }

        return count;
    }
};

// Time Complexity: O(MN), since we visit each cell at most once.
// Space Complexity: O(MN) in the worst case (when the grid is filled with land), due to the recursion stack in DFS.
// For BFS, the space complexity would be O(min(M, N)) in the worst case
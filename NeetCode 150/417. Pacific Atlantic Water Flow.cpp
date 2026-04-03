#include <vector>
using namespace std;

class Solution {
public:
    int m, n;
    int dx[4]={-1, 1, 0, 0};
    int dy[4]={0, 0, -1, 1};

    void dfs(int x, int y, int prev_h, const vector<vector<int>>& h, vector<vector<bool>>& visited){
        if(x<0 || x>=m || y<0 || y>=n || visited[x][y] || h[x][y]<prev_h){
            return;
        }

        visited[x][y]=true;
        for(int i=0; i<4; ++i){
            dfs(x+dx[i], y+dy[i], h[x][y], h, visited);
        }
    }
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        m=heights.size();
        n=heights[0].size();

        vector<vector<bool>> pac(m, vector<bool>(n, false));
        vector<vector<bool>> atl(m, vector<bool>(n, false));

        for(int i=0; i<m; ++i){
            dfs(i, 0, 0, heights, pac);
            dfs(i, n-1, 0, heights, atl);
        }
        for(int j=0; j<n; ++j){
            dfs(0, j, 0, heights, pac);
            dfs(m-1, j, 0, heights, atl);
        }

        vector<vector<int>> res;
        for(int i=0; i<m; ++i){
            for(int j=0; j<n; ++j){
                if(pac[i][j] && atl[i][j]){
                    res.push_back({i, j});
                }
            }
        }

        return res;
    }
};

// Time: O(M*N)
// Space: O(M*N)
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        // use bfs to solve the problem
        queue<pair<int, int>> q; // store rotten oranges
        int freshCount=0;
        int time=0;

        for(int i=0; i<grid.size(); ++i){
            for(int j=0; j<grid[0].size(); ++j){
                if(grid[i][j]==0)
                    continue;
                else if(grid[i][j]==1)
                    ++freshCount;
                else // grid[i][j]==2
                    q.push({i, j});
            }
        }

        if(freshCount==0)
            return 0;

        vector<pair<int,int>> directions={{0,1}, {0,-1}, {1,0}, {-1,0}};

        while(!q.empty()){

            int curNum=q.size();

            for(int i=0; i<curNum; ++i){
                auto cur=q.front();
                q.pop();

                int row=cur.first;
                int col=cur.second;

                for(auto& dir: directions){
                    int x=row+dir.first;
                    int y=col+dir.second;

                    if(x>=0 && y>=0 && x<grid.size() && y<grid[0].size() && grid[x][y]==1){
                        grid[x][y]=2;
                        q.push({x,y});
                        --freshCount;
                    }
                }
            }
            if(!q.empty())
                ++time;
        }

        if(freshCount!=0)
            return -1;

        return time;
    }
};

// Time: O(M*N)
// Space: O(M*N), for the queue to store the rotten oranges
class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points) {
        int cost=0;
        int n=points.size();

        vector<bool> visited(n, false);
        vector<int> dist(n, INT_MAX);
 
        // start from any point
        dist[0]=0;
        int count=0; // node count

        while(count<n){
            int u=-1;
            int min_dist=INT_MAX;

            for(int i=0; i<n; ++i){
                if(!visited[i] && dist[i]<min_dist){
                    u=i;
                    min_dist=dist[i];
                }
            }

            if(u==-1){
                break;
            }

            visited[u]=true;
            cost+=min_dist;
            ++count;

            // update dist
            for(int v=0; v<n; ++v){
                if(!visited[v]){
                    int d=abs(points[v][0]-points[u][0])+abs(points[v][1]-points[u][1]);
                    dist[v]=min(dist[v], d);
                }
            }
        }

        return cost;

    }
};

// Time Complexity: O(N^2)
// Space Complexity: O(N)
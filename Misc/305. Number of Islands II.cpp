#include <vector>
using namespace std;

class Solution {
public:
    // int find(vector<int>& parent, int idx){
    //     if(parent[idx]==idx){
    //         return idx;
    //     }
    //     return parent[idx]=find(parent, parent[idx]);
    // }
    // vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {
    //     vector<int> parent(m*n, -1);
    //     vector<int> rank(m*n, 0);
    //     vector<int> res;
    //     int count=0;

    //     int dx[4]={-1, 1, 0, 0};
    //     int dy[4]={0, 0, -1, 1};

    //     for(const auto& p: positions){
    //         int x=p[0];
    //         int y=p[1];
    //         int idx=x*n+y;

    //         if(parent[idx]!=-1){
    //             res.push_back(count);
    //             continue;
    //         }

    //         parent[idx]=idx;
    //         ++count;
    //         ++rank[idx];

    //         for(int i=0; i<4; ++i){
    //             int nx=x+dx[i];
    //             int ny=y+dy[i];
    //             int nidx=nx*n+ny;

    //             if(nx>=0 && nx<m && ny>=0 && ny<n && parent[nidx]!=-1){
    //                 int r1=find(parent, idx);
    //                 int r2=find(parent, nidx);

    //                 if(r1==r2){
    //                     continue;
    //                 }

    //                 if(rank[r1]<rank[r2]){
    //                     parent[r1]=r2;
    //                 }
    //                 else if(rank[r1]>rank[r2]){
    //                     parent[r2]=r1;
    //                 }
    //                 else{
    //                     parent[r1]=r2;
    //                     ++rank[r2];
    //                 }
    //                 --count;
    //             }
    //         }
    //         if(count<0){
    //             count=0;
    //         }
    //         res.push_back(count);
    //     }

    //     return res;
    // }

    struct DSU {
        vector<int> parent;
        vector<int> rank;
        int count;

        DSU(int n): parent(n, -1), rank(n, 0), count(0){}

        bool addLand(int idx){
            if(parent[idx]!=-1){
                return false;
            }
            parent[idx]=idx;
            ++count;
            // ++rank[idx];
            return true;
        }

        int find(int idx){
            if(idx!=parent[idx]){
                parent[idx]=find(parent[idx]);
            }
            return parent[idx];
        }

        void unite(int i, int j){
            int r1=find(i);
            int r2=find(j);
            if(r1!=r2){
                if(rank[r1]>rank[r2]){
                    parent[r2]=r1;
                }
                else if(rank[r2]>rank[r1]){
                    parent[r1]=r2;
                }
                else{
                    parent[r2]=r1;
                    ++rank[r1];
                }
                --count;
            }
        }
    };

    vector<int> numIslands2(int m, int n, vector<vector<int>>& positions) {
        DSU dsu(m*n);

        vector<int> res;

        int dx[4]={-1, 1, 0, 0};
        int dy[4]={0, 0, -1, 1};

        for(const auto& p: positions){
            int x=p[0];
            int y=p[1];
            int idx=x*n+y;
            if(!dsu.addLand(idx)){
                res.push_back(dsu.count);
                continue;
            }

            for(int i=0; i<4; ++i){
                int nx=x+dx[i];
                int ny=y+dy[i];
                int nidx=nx*n+ny;

                if(nx>=0 && nx<m && ny>=0 && ny<n && dsu.parent[nidx]!=-1){
                    dsu.unite(idx, nidx);
                }
            }

            res.push_back(dsu.count);
        }

        return res;
    }
};

// By using path compression and union by rank, the DSU operations (find and unite) run in nearly O(1) time
// Time Complexity: O(m*n + k*alpha(m*n)) where k is the number of positions, m and n are the dimensions of the grid, and alpha is the inverse Ackermann function which is very slow growing and can be considered almost constant in practice.
// Space Complexity: O(m*n) for the DSU data structure to store the parent and rank arrays.
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
        int i=0, j=0;
        vector<vector<int>> res;

        while(i<firstList.size()&&j<secondList.size()){
            // check overlap
            int maxLeft=std::max(firstList[i][0], secondList[j][0]);
            int minRight=std::min(firstList[i][1], secondList[j][1]);
            if(maxLeft<=minRight){
                res.push_back({maxLeft, minRight});
            }
            if(firstList[i][1]<secondList[j][1]){
                ++i;
            }
            else{
                ++j;
            }
        }

        return res;
    }
};

// [[0,2],[5,10],[13,23],[24,25]] i=3
// [[1,5],[8,12],[15,24],[25,26]] j=3
// [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

// Time Complexity: O(M+N), where M and N are the lengths of firstList and secondList, respectively.
// Space Complexity: O(M+N) for the result vector in the worst case when all intervals overlap.
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int len=gas.size();
        gas[0]-=cost[0];
        for(int i=1; i<len; ++i){
            gas[i]-=cost[i];
            gas[i]+=gas[i-1];
        }
        if(gas[len-1]<0){
            return -1;
        }

        int minDiff=INT_MAX;
        int minIdx=-1;
        for(int i=0; i<len; ++i){
            if(minDiff>gas[i]){
                minDiff=gas[i];
                minIdx=i;
            }
        }

        return (minIdx+1)%len;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
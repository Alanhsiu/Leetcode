#include <vector>

using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int curMin=nums[0];
        int curMax=nums[0];
        int globalMax=nums[0];

        for(int i=1; i<nums.size(); ++i){
            int n=nums[i];
            if(n>=0){
                curMin=std::min(curMin*n, n);
                curMax=std::max(curMax*n, n);
            }
            else{ // n<0
                int tmpMin=curMin;
                curMin=std::min(curMax*n, n);
                curMax=std::max(tmpMin*n, n);
            }
            globalMax=std::max(globalMax, curMax);
        }

        return globalMax;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
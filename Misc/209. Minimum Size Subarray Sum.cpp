#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int minLen=INT_MAX;
        int left=0;
        int curSum=0;

        for(int right=0; right<nums.size(); ++right){
            // expand window
            curSum+=nums[right];
            if(curSum>=target){
                // reduce window
                while(curSum>=target){
                    curSum-=nums[left];
                    ++left;
                }
                minLen=std::min((right-left+2), minLen);
            }
        }
        if(minLen==INT_MAX){
            return 0;
        }

        return minLen;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
#include <vector>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        // 1. include nums[0]: find max in nums[2, ..., n-2]
        // 2. not include nums[0]: find max in nums[1, ..., n-1]

        int n=nums.size();
        int prev1=0;
        int prev2=0;

        for(int i=2; i<n-1; ++i){
            int cur=std::max(prev1, prev2+nums[i]);
            prev2=prev1;
            prev1=cur;
        }
        int max1=prev1+nums[0]; // nums[0] is 0 or positive

        prev1=0;
        prev2=0;
        
        for(int i=1; i<n; ++i){
            int cur=std::max(prev1, prev2+nums[i]);
            prev2=prev1;
            prev1=cur;
        }
        int max2=prev1;
        
        return std::max(max1, max2);
    }
};

// Time: O(N)
// Space: O(1)
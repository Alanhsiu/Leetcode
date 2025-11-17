class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int curMax=nums[0];
        int globalMax=nums[0];

        for(int i=1; i<nums.size(); ++i){
            // curMax is the max ending with i
            curMax=std::max(curMax+nums[i], nums[i]);
            globalMax=std::max(curMax, globalMax);
        }

        return globalMax;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
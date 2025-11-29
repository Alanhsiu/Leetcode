class Solution {
public:
    bool canJump(vector<int>& nums) {
        int curFarthest=0;
        int len=nums.size();

        for(int i=0; i<len; ++i){
            if(curFarthest>=len-1){
                return true;
            }
            if(curFarthest<i){
                return false;
            }
            curFarthest=std::max(curFarthest, i+nums[i]);
        }

        return false;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
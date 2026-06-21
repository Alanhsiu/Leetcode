class Solution {
public:
    void moveZeroes(vector<int>& nums) {        
        int slow=0;
        for(int fast=0; fast<nums.size(); ++fast){
            if(nums[fast]!=0){
                if(slow!=fast){
                    std::swap(nums[slow], nums[fast]);
                }
                ++slow;
            }
        } 
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
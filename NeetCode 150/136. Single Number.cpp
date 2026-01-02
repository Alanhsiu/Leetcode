class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // A^A=0
        int ans=0;
        for(const int& n: nums){
            ans^=n;
        }
        return ans;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
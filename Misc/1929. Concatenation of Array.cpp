class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        /* Method 1: consider cache locality

        // 1. get the len of the nums
        // 2. init a vector with size len*2
        // 3. fill the 0 ~ len*2
        
        int len=nums.size();
        vector<int> res(len*2, 0);

        for(int i=0; i<len; ++i){
            res[i]=nums[i];
        }
        for(int i=0; i<len; ++i){
            res[i+len]=nums[i];
        }
        return res;

        */

        /* Method 2: standard library */
        vector<int> res;
        res.reserve(nums.size()*2);
        res.insert(res.end(), nums.begin(), nums.end());
        res.insert(res.end(), nums.begin(), nums.end());

        return res;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
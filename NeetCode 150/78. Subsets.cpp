class Solution {
public:
    void getSubset(vector<vector<int>>& res, vector<int>& cur, vector<int>& nums, int idx){
        if(idx==nums.size()){
            res.push_back(cur);
            return;
        }
        getSubset(res, cur, nums, idx+1);
        cur.push_back(nums[idx]);
        getSubset(res, cur, nums, idx+1);
        cur.pop_back();
    }
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> cur;

        getSubset(res, cur, nums, 0);
        return res;
    }
};

// Time Complexity: O(2^N * N). Why N? Because we need to copy the current subset to the result.
// Space Complexity: O(2^N * N), and O(N) for the auxiliary space.
class Solution {
public:
    
    void dfs(vector<vector<int>>& res, const vector<int>& nums, vector<int>& cur, int idx) {
        if(idx==nums.size()){
            res.push_back(cur);
            return;    
        }
        cur.push_back(nums[idx]);
        dfs(res, nums, cur, idx+1);
        cur.pop_back();
        int next=idx+1;
        while(next<nums.size() && nums[next]==nums[idx]){
            ++next;
        }
        dfs(res, nums, cur, next);
    }
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> cur;
        std::sort(nums.begin(), nums.end());
        dfs(res, nums, cur, 0);
        return res;
    }
};

// Time Complexity: O(2^N * N).
// Space Complexity: O(2^N * N) for the result, O(N) for the auxiliary space.
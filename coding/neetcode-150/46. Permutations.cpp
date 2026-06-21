class Solution {
public:
    void dfs(vector<vector<int>>& res, vector<int>& cur, int n, int idx) {
        if(idx==n-1) {
            res.push_back(cur);
            return;
        }

        for(int i=idx; i<n; ++i) {
            swap(cur[idx], cur[i]);
            dfs(res, cur, n, idx+1);
            swap(cur[idx], cur[i]);
        }
    }

    vector<vector<int>> permute(vector<int>& nums) {
        int n=nums.size();
        vector<vector<int>> res;
        dfs(res, nums, n, 0);
        return res;
    }
};

// Time Complexity: O(N!)
// Space Complexity: O(N)
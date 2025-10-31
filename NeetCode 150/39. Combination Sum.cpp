class Solution {
public:
    void find(vector<vector<int>>& result, vector<int>& cur, vector<int>& candidates, int target, int idx){
        if(target==0){
            result.push_back(cur);
            return;
        }

        if(target<0 || idx>=candidates.size() || candidates[idx]>target)
            return;

        cur.push_back(candidates[idx]);
        find(result, cur, candidates, target-candidates[idx], idx);
        cur.pop_back();
        find(result, cur, candidates, target, idx+1);
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> cur;
        std::sort(candidates.begin(), candidates.end());
        find(result, cur, candidates, target, 0);
        return result;
    }
};

// 2 ...
// 2 2 ...
// 2 3 ...
// ...
// ======= (pop back)
// 3 ...
// ...

// Time Complexity: O(N^T/M) where N is the number of candidates, T is the target, M is the minimum candidate
// Space Complexity: O(T/M)
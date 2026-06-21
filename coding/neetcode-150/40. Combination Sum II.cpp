class Solution {
public:
    void find(vector<vector<int>>& result, vector<int>& cur, vector<int>& candidates, int target, int idx){
        if(target==0){
            result.push_back(cur);
            return;
        }

        if(target<0 || idx>=candidates.size() || candidates[idx]>target){
            return;
        }

        cur.push_back(candidates[idx]);
        find(result, cur, candidates, target-candidates[idx], idx+1);
        cur.pop_back();
        int next_idx=idx+1;
        while(next_idx<candidates.size() && candidates[next_idx]==candidates[next_idx-1]){
            ++next_idx;
        }
        find(result, cur, candidates, target, next_idx);
    }

    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> cur;

        std::sort(candidates.begin(), candidates.end());
        find(result, cur, candidates, target, 0);
        return result;
    }
};

// Time Complexity: O(N^T/M) where N is the number of candidates, T is the target, M is the minimum candidate
// Space Complexity: O(T/M)
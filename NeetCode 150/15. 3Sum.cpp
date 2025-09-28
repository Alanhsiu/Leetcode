class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>> result;

        int n=nums.size();

        if(n<3)
            return result;

        sort(nums.begin(), nums.end());

        for(int i=0; i<n; ++i){
            // reduce to two-sum problem
            if(i>0 && nums[i]==nums[i-1])
                continue;

            // early exit
            if(nums[i]>0)
                break;

            int j=i+1;
            int k=n-1;

            while(j<k){
                int curSum=nums[i]+nums[j]+nums[k];
                if(curSum==0){
                    result.push_back({nums[i], nums[j], nums[k]});
                    ++j;
                    while(j<k && nums[j-1]==nums[j])
                        ++j;
                    --k;
                    while(k>j && nums[k+1]==nums[k])
                        --k;
                }
                else if(curSum<0)
                    ++j;
                else
                    --k;
            }
        }

        return result;
    }
};

// Time: O(N^2)
// Space: O(1)
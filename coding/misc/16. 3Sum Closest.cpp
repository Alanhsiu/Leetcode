class Solution {
public:
    int threeSumClosest(vector<int>& nums, int target) {
        int n=nums.size();
        int closetSum=nums[0]+nums[1]+nums[2];
        
        sort(nums.begin(), nums.end());

        for(int i=0; i<n-2; ++i){
            int j=i+1;
            int k=n-1;

            while(j<k){
                int curSum=nums[i]+nums[j]+nums[k];
                int curDiff=curSum-target;
                if(abs(curDiff)<abs(closetSum-target))
                    closetSum=curSum;
                
                if(curDiff==0)
                    return target;
                else if(curDiff>0)
                    k--;
                else
                    j++;
            }

        }

        return closetSum;
    }
};

// Time: O(N^2)
// Space: O(1)
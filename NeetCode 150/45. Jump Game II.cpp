class Solution {
public:
    int jump(vector<int>& nums) {
        // use greedy algorithm
        // iterate from 0 to n-1, each time we keep "the max_pos we can jump to" and "the min number of jumps"

        int max_pos=0;
        int end=0;
        int jumps=0;

        int n=nums.size();

        if(n==1)
            return 0;

        for(int i=0; i<n-1; ++i){
            max_pos=std::max(max_pos, i+nums[i]);

            if(i==end){
                ++jumps;
                end=max_pos;

                if(end>=n-1)
                    return jumps;
            }
        }

        return jumps;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
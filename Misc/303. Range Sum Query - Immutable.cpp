class NumArray {
public:
    NumArray(vector<int>& nums) {
        int N=nums.size();

        accSum.resize(N+1, 0);
        for(int i=0; i<N; ++i){
            accSum[i+1]=accSum[i]+nums[i]; // accSum[1]=nums[0], accSum[2]=nums[0]+nums[1], ...
        }
    }
    
    int sumRange(int left, int right) {
        return accSum[right+1]-accSum[left];
    }

    vector<int> accSum; // accumulated sum
};

// Time Complexity: O(N) for constructor, O(1) for sumRange
// Space Complexity: O(N) for accSum
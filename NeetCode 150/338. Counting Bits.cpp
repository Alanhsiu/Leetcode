class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n+1);

        // use bottom-up dynamic programming
        ans[0]=0;
        for(int i=1; i<=n; ++i){
            ans[i]=ans[i>>1]+(i&1);
        }

        return ans;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int len1=text1.length();
        int len2=text2.length();
        vector<int> dp(len2+1, 0);

        // update dp row by row
        for(int i=1; i<=len1; ++i){
            int prev_diag=0;
            for(int j=1; j<=len2; ++j){
                int tmp=dp[j];
                if(text1[i-1]==text2[j-1]){ // text1 and text2 are 0-indexed
                    dp[j]=prev_diag+1;
                }
                else{
                    dp[j]=std::max(dp[j], dp[j-1]);
                }
                prev_diag=tmp;
            }
        }

        return dp[len2];
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(N)
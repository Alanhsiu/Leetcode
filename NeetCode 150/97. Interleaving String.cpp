class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        // use dp, dp[i][j] means whether s3[0:i+j-1] is an interleaving of s1[0:i-1] and s2[0:j-1]
        int len1=s1.length();
        int len2=s2.length();
        int len3=s3.length();

        if(len1+len2!=len3){
            return false;
        }

        if(len1>len2){
            return isInterleave(s2, s1, s3);
        }

        vector<bool> dp(len1+1, false);

        // init
        dp[0]=true;
        for(int i=1; i<=len1; ++i){
            dp[i]=(dp[i-1] && s1[i-1]==s3[i-1]);
        }

        for(int j=1; j<=len2; ++j){
            dp[0]=(dp[0] && s2[j-1]==s3[j-1]);
            for(int i=1; i<=len1; ++i){
                dp[i]=(dp[i-1] && s1[i-1]==s3[i+j-1])||(dp[i] && s2[j-1]==s3[i+j-1]);
            }
        }

        return dp[len1];
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(min(M, N))
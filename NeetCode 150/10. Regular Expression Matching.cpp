class Solution {
public:
    bool isMatch(string s, string p) {
        int slen=s.length();
        int plen=p.length();

        vector<vector<bool>> dp(slen+1, vector<bool>(plen+1, false)); // 1-based indice

        // initialize
        dp[0][0]=true;
        for(int j=1; j<=plen; ++j){
            if(p[j-1]=='*'){
                dp[0][j]=dp[0][j-2];
            }
        }

        for(int i=1; i<=slen; ++i){
            for(int j=1; j<=plen; ++j){
                if(p[j-1]!='*'){
                    if(p[j-1]=='.'||s[i-1]==p[j-1])
                        dp[i][j]=dp[i-1][j-1];
                }
                else{ // p[j]=='*'
                    // zero || one or more preceding element
                    dp[i][j]=dp[i][j-2];
                    if(s[i-1]==p[j-2]||p[j-2]=='.'){
                        dp[i][j]=dp[i][j]||dp[i-1][j];
                    }
                }
            }
        }

        return dp[slen][plen];
    }
};

// Time: O(M*N), where M is the length of s and N is the length of p
// Space: O(M*N)
class Solution {
public:
    int minDistance(string word1, string word2) {
        // - - h o r s e (len1)
        // - 0 1 2 3 4 5
        // r 1
        // o 2
        // s 3
        // (len2)

        int len1=word1.size();
        int len2=word2.size();

        vector<int> dp(len1+1, 0);

        // init dp
        for(int j=0; j<=len1; ++j){
            dp[j]=j;
        }

        for(int i=1; i<=len2; ++i){
            int prev_diag=dp[0]; // record prev[j-1]
            int tmp=0;
            
            dp[0]=i;
            for(int j=1; j<=len1; ++j){
                tmp=dp[j];
                if(word1[j-1]==word2[i-1]){
                    dp[j]=prev_diag;
                }
                else{
                    dp[j]=std::min(dp[j-1], std::min(prev_diag, dp[j]))+1;
                }
                prev_diag=tmp;
            }
        }

        return dp[len1];
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(N)
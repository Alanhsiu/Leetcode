class Solution {
public:
    int numDistinct(string s, string t) {
        int len1=s.length();
        int len2=t.length();
        if(len1<len2){
            return 0;
        }

        vector<int> dp(len1, 0); // dp[i] means the num of subsequence ending with s[i]
        vector<long long> prefixSum(len1, 0); // prefixSum means the accumulated num ending with s[i]

        // init
        if(s[0]==t[0]){
            prefixSum[0]=1;
        }
        for(int i=1; i<len1; ++i){
            if(s[i]==t[0]){
                prefixSum[i]+=1;
            }
            prefixSum[i]+=prefixSum[i-1];
        }

        for(int j=1; j<len2; ++j){
            for(int i=j; i<len1; ++i){
                if(s[i]==t[j]){
                    dp[i]=prefixSum[i-1];
                }
                else{
                    dp[i]=0;
                }
            }
            prefixSum[j-1]=0;
            for(int i=j; i<len1; ++i){
                prefixSum[i]=dp[i]+prefixSum[i-1];
            }
        }

        return prefixSum[len1-1];
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(M), M is the length of s.
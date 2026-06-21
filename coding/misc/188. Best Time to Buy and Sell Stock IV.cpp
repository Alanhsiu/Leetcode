class Solution {
public:
/*
    int maxProfit(int k, vector<int>& prices) {
        int n=prices.size();
        vector<vector<vector<int>>> dp(2, vector<vector<int>>(k+1, vector<int>(2, -1e5)));
        dp[0][0][1]=-prices[0];

        for(int i=1; i<n; i++){
            dp[1][0][1]=max(dp[0][0][1], -prices[i]);
            for(int j=1; j<k; j++){
                dp[1][j][0]=max(dp[0][j][0], dp[0][j-1][1]+prices[i]);
                dp[1][j][1]=max(dp[0][j][1], dp[0][j][0]-prices[i]);
            }
            dp[1][k][0]=max(dp[0][k][0], dp[0][k-1][1]+prices[i]);

            dp[0][0][1]=dp[1][0][1];
            for(int j=1; j<k; j++){
                dp[0][j][0]=dp[1][j][0];
                dp[0][j][1]=dp[1][j][1];
            }
            dp[0][k][0]=dp[1][k][0];
        }

        int result=0;
        for(int i=1; i<=k; i++)
            result=max(result, dp[1][i][0]);
        return result; 
    }
*/
    int maxProfit(int k, vector<int>& prices) {
        int n=prices.size();

        vector<int> buy(k+1, -1e5); // ending with buy j times
        vector<int> sell(k+1, 0); // ending with buy and sell j times

        for(int price: prices){
            for(int j=1; j<=k; j++){
                buy[j]=max(buy[j], sell[j-1]-price);
                sell[j]=max(sell[j], buy[j]+price);
            }
        }

        return sell[k];
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
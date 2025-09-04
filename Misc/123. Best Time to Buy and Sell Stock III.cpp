class Solution {
public:
/*
    int maxProfit(vector<int>& prices) {
        int n=prices.size(); // n is the total number of days
        // dp[i][k][0/1] means day i, already k transactions, notHold/hold
        vector<vector<vector<int>>> dp(n, vector<vector<int>>(3, vector<int>(2, -1e5)));

        // initialization
        dp[0][0][1]=-prices[0];

        for(int i=1; i<n; i++){
            dp[i][0][1]=max(dp[i-1][0][1], -prices[i]);
            dp[i][1][0]=max(dp[i-1][1][0], dp[i-1][0][1]+prices[i]);
            dp[i][1][1]=max(dp[i-1][1][1], dp[i-1][1][0]-prices[i]);
            dp[i][2][0]=max(dp[i-1][2][0], dp[i-1][1][1]+prices[i]);
        }

        int result=max(dp[n-1][1][0], dp[n-1][2][0]);

        return max(0, result);
    }
*/
/*
    int maxProfit(vector<int>& prices) {
        int n=prices.size();
        vector<vector<vector<int>>> dp(2, vector<vector<int>>(3, vector<int>(2, -1e5)));
        dp[0][0][1]=-prices[0];

        for(int i=1; i<n; i++){
            dp[1][0][1]=max(dp[0][0][1], -prices[i]);
            dp[1][1][0]=max(dp[0][1][0], dp[0][0][1]+prices[i]);
            dp[1][1][1]=max(dp[0][1][1], dp[0][1][0]-prices[i]);
            dp[1][2][0]=max(dp[0][2][0], dp[0][1][1]+prices[i]);

            dp[0][0][1]=dp[1][0][1];
            dp[0][1][0]=dp[1][1][0];
            dp[0][1][1]=dp[1][1][1];
            dp[0][2][0]=dp[1][2][0];
        }

        int result=max(dp[1][1][0], dp[1][2][0]);

        return max(0, result); 
    }
*/
    int maxProfit(vector<int>& prices) {
        int n=prices.size();

        vector<int> buy(3, -1e5); // buy[j] ending with the jth buy
        vector<int> sell(3, 0); // sell[j] ending with the jth sell

        for(int price: prices){
            for(int j=1; j<=2; j++){
                buy[j]=max(buy[j], sell[j-1]-price);
                sell[j]=max(sell[j], buy[j]+price);
            }
        }

        return sell[2];
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
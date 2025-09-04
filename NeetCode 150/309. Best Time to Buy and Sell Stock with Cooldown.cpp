class Solution {
public:
/*
    int maxProfit(vector<int>& prices) {
        int numOfDays=prices.size();

        if(numOfDays<2)
            return 0;

        vector<vector<int>> dp(numOfDays, vector<int>(2, 0)); // max profit (end with hold, end with notHold)

        // initialization
        dp[0][0]=-prices[0];
        dp[0][1]=0;
        dp[1][0]=max(-prices[0], -prices[1]);
        dp[1][1]=max(0, dp[0][0]+prices[1]);

        for(int i=2; i<numOfDays; i++){
            dp[i][0]=max(dp[i-1][0], dp[i-2][1]-prices[i]);
            dp[i][1]=max(dp[i-1][1], dp[i-1][0]+prices[i]);
        }

        return dp[numOfDays-1][1];
    }
*/

    // dp with O(1) space
    int maxProfit(vector<int>& prices) {
        int numOfDays=prices.size();

        if(numOfDays<2)
            return 0;

        int prevHold, hold, prevNotHold, notHold;
        prevHold=-prices[0];
        hold=max(prevHold, -prices[1]);
        prevNotHold=0;
        notHold=max(prevNotHold, prevHold+prices[1]);

        for(int i=2; i<numOfDays; i++){
            prevHold=hold;
            hold=max(hold, prevNotHold-prices[i]);
            prevNotHold=notHold;
            notHold=max(notHold, prevHold+prices[i]);
        }

        return notHold;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
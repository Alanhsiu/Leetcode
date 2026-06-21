#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        // build a vector, to record the fewest num of coins to make up the corresponding amount
        std::vector<int> dp(amount+1, amount+1);
        // base case
        dp[0]=0;

        /* not necessary
        for(int deno: coins){
            if(deno<=amount){
                dp[deno]=1;
            }
        }
        */

        for(int i=1; i<amount+1; i++){
            for(int deno: coins){
                if(i-deno>=0)
                    dp[i]=std::min(dp[i-deno]+1, dp[i]);
            }
        }

        return (dp[amount]>amount)? -1 : dp[amount];
    }
};

// Time Complexity: O(n*m) where n is the amount and m is the number of coins
// Space Complexity: O(n)
#include <vector>
using namespace std;

class Solution {
public:
    int change(int amount, vector<int>& coins) {
        // use dynamic programmming to update the number of combinations
        vector<int> dp(amount+1, 0);

        // initialize
        dp[0]=1;

        for(int coin: coins){ // 1, 2, 5
            for(int i=1; i<amount+1; i++){ // i: 1 to 5
                if(i-coin>=0){
                    dp[i]+=dp[i-coin];
                }
            }
        }

        return dp[amount];
    }
};

// Time Complexity: O(n*m) where n is the amount and m is the number of coins
// Space Complexity: O(n)
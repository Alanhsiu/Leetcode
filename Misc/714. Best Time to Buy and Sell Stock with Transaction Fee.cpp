class Solution {
public:
    int maxProfit(vector<int>& prices, int fee) {
        int numOfDays=prices.size();
        vector<int> hold(numOfDays, 0);
        vector<int> notHold(numOfDays, 0);

        hold[0]=-prices[0];
        notHold[0]=0;

        for(int i=1; i<numOfDays; i++){
            hold[i]=max(hold[i-1], notHold[i-1]-prices[i]);
            notHold[i]=max(notHold[i-1], hold[i-1]+prices[i]-fee);
        }

        return notHold[numOfDays-1];
    }
};

// Time Complexity: O(n)
// Space Complexity: O(n), could be optimized to O(1)
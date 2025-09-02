class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit=0;
        int numOfDays=prices.size();
        
        if(numOfDays<2)
            return 0;

        int i=0;
        while(i<numOfDays){
            bool isBuyPoint=false;
            if(i==0)
                isBuyPoint=prices[i]<prices[i+1];
            else if(i==numOfDays-1)
                isBuyPoint=false; // we don't buy at the last time
            else 
                isBuyPoint = prices[i]<prices[i+1] && prices[i]<=prices[i-1];
                
            if(isBuyPoint){
                // find next local Max to sell
                int j=i+1; // j is sellPoint
                while(j<numOfDays-1){
                    if(prices[j]>prices[j+1])
                        break;
                    j++;
                }
                profit+=prices[j]-prices[i];
                i=j+1;
            }
            else
                i++;
        }

        return profit;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
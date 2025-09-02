class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int curMaxProfit=0;
        int curMinPrice=prices[0];

        for(int price: prices){
            curMaxProfit=std::max(curMaxProfit, price-curMinPrice);
            curMinPrice=std::min(curMinPrice, price);
        }

        return curMaxProfit;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
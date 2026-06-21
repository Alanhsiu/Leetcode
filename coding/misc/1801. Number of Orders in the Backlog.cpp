class Solution {
public:
    int getNumberOfBacklogOrders(vector<vector<int>>& orders) {
        std::priority_queue<pair<int, int>> max_buy_orders;
        std::priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> min_sell_orders;

        for(const auto& order: orders){
            int price=order[0];
            int amount=order[1];
            int orderType=order[2];

            if(orderType==0){ // buy
                while(amount>0 && !min_sell_orders.empty()){
                    auto top_cell=min_sell_orders.top();
                    int sell_price=top_cell.first;
                    int sell_amount=top_cell.second;

                    if(sell_price>price){
                        break;
                    }
                    else{ // able to match
                        min_sell_orders.pop();
                        if(sell_amount>amount){
                            min_sell_orders.push({sell_price, sell_amount-amount});
                            amount=0;
                        }
                        else{
                            amount-=sell_amount;
                        }
                    }
                }
                if(amount>0){
                    max_buy_orders.push({price, amount});
                }
            }
            else{ // sell
                while(amount>0 && !max_buy_orders.empty()){
                    auto top_cell=max_buy_orders.top();
                    int buy_price=top_cell.first;
                    int buy_amount=top_cell.second;

                    if(buy_price<price){
                        break;
                    }
                    else{ // able to match
                        max_buy_orders.pop();
                        if(buy_amount>amount){
                            max_buy_orders.push({buy_price, buy_amount-amount});
                            amount=0;
                        }
                        else{
                            amount-=buy_amount;
                        }
                    }
                }
                if(amount>0){
                    min_sell_orders.push({price, amount});
                }
            }
        }

        const long long MOD=1e9+7;
        long long res=0;
        while(!max_buy_orders.empty()){
            res=(res+max_buy_orders.top().second)%MOD;
            max_buy_orders.pop();
        }
        while(!min_sell_orders.empty()){
            res=(res+min_sell_orders.top().second)%MOD;
            min_sell_orders.pop();
        }

        return (int)res;
    }
};

// Time Complexity: O(NlogN)
// Space Complexity: O(N)
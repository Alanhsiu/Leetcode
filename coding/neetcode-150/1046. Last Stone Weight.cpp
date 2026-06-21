class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        
        std::priority_queue<int> max_heap(stones.begin(), stones.end());

        int x=-1, y=-1;
        while(max_heap.size()>1){
            y=max_heap.top();
            max_heap.pop();
            x=max_heap.top();
            max_heap.pop();

            if(y>x){
                max_heap.push(y-x);
            }

        }
        if(max_heap.empty()){
            return 0;
        }
        return max_heap.top();
    }
};

// Time Complexity: O(NlogN)
// Space Complexity: O(N)
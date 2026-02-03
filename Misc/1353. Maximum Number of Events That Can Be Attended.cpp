class Solution {
public:
    int maxEvents(vector<vector<int>>& events) {
        int len=events.size();
        std::sort(events.begin(), events.end(), [](const auto& a, const auto& b){return a[0]<b[0];});

        std::priority_queue<int, std::vector<int>, greater<int>> pq;

        int idx=0; // event idx
        int res=0;
        
        // find max day
        int maxDay=0;
        for(int i=0; i<len; ++i){
            maxDay=std::max(maxDay, events[i][1]);
        }

        for(int i=1; i<=maxDay; ++i){
            while(idx<len && events[idx][0]==i){
                pq.push(events[idx][1]);
                ++idx;
            }
            if(!pq.empty()){
                pq.pop();
                ++res;
            }
            while(!pq.empty() && pq.top()<=i){
                pq.pop();
            }
        }

        return res;
    }
};

// [2,5],[2,3],[3,4]
// idx: 0~2 
// maxDay
// for 0~maxDay
// add events start with the current day to the min_heap (store end day)
// check expire from the top

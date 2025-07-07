#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxEvents(vector<vector<int>>& events) {
        sort(events.begin(), events.end(), [](const auto& a, const auto& b){return a[0]<b[0];});
        int attended_events = 0;
        int event_idx = 0;
        std::priority_queue<int, std::vector<int>, std::greater<int>> min_heap;
        
        for (int current_day = 1; current_day <= 100001; ++current_day) {
            if(min_heap.empty() && event_idx==events.size())
                break;
            while(event_idx<events.size() && events[event_idx][0]==current_day){
                min_heap.push(events[event_idx][1]);
                ++event_idx;
            }
            while(!min_heap.empty() && min_heap.top()<current_day){
                min_heap.pop();
            }
            if(!min_heap.empty()){
                min_heap.pop();
                ++attended_events;
            }
        }
        return attended_events;
    }
};

// Time: O(NlogN+D), where D is the maximum possible days.
// Space: O(N) for min_heap.
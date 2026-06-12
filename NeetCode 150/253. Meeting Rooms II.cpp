#include <vector>
#include <queue>

using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        int count=0;
        int n=intervals.size();
        std::priority_queue<int, vector<int>, greater<int>> pq;
        pq.push(0);

        sort(intervals.begin(), intervals.end());
        for(const auto& i: intervals){
            int curMin=pq.top();
            if(curMin<=i[0]){
                pq.pop();
                pq.push(i[1]);
            }
            else{
                pq.push(i[1]);
            }
        }
        
        return pq.size();
    }
};

// Time: O(nlogn)
// Space: O(n) in the worst case when all meetings overlap, otherwise O(k) where k is the maximum number of overlapping meetings.
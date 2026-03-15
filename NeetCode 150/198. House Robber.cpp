#include <vector>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        int prev1=0;
        int prev2=0;

        for(const int n: nums){
            int cur=std::max(prev1, n+prev2);
            prev2=prev1;
            prev1=cur;
        }

        return prev1;
    }
};

// Time: O(N)
// Space: O(1)
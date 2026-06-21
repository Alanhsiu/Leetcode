#include <vector>
using namespace std;

class Solution {
   public:
    int findLucky(vector<int>& arr) {
        int count[501] = {0};  // index 0 is unused
        for (int n : arr)
            ++count[n];
        for (auto n = arr.size(); n > 0; --n)
            if (n == count[n])
                return n;
        return -1;
    }
};

// Time Complexity: O(n). Since MAX_VAL is constant.
// Space Complexity: O(MAX_VAL).
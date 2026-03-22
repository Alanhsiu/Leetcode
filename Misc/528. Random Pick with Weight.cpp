#include <vector>
#include <algorithm>
using namespace std;

class Solution {
    vector<int> prefixSum;
public:
    Solution(vector<int>& w) {
        prefixSum.resize(w.size());
        prefixSum[0]=w[0];
        for(int i=1; i<w.size(); ++i){
            prefixSum[i]=prefixSum[i-1]+w[i];
        }
    }
    
    int pickIndex() {
        int target=rand()%prefixSum.back();
        auto it=std::upper_bound(prefixSum.begin(), prefixSum.end(), target);
        return distance(prefixSum.begin(), it);
    }
};

/**
 * Your Solution object will be instantiated and called as such:
 * Solution* obj = new Solution(w);
 * int param_1 = obj->pickIndex();
 */

// Time Complexity: O(N) for constructor, O(logN) for pickIndex() where N is the size of the input vector w.
// Space Complexity: O(N) for storing the prefix sum array.
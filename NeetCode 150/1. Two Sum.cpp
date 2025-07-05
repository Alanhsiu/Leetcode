#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
   public:
    vector<int> twoSum(vector<int>& nums, int target) {
        std::unordered_map<int, int> umap;
        int n = nums.size();
        for (int i = 0; i < n; ++i) {
            int complement = target - nums[i];
            if (umap.count(complement))  // O(1)
                return {i, umap[complement]};
            umap[nums[i]] = i;  // O(1)
        }
        return {};  // No solution found
    }
};
// Time Complexity: O(n). Single pass through the array.
// Space Complexity: O(n). In the worst case, the hash map stores all elements.
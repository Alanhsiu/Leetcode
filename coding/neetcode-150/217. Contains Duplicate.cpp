#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> uset;
        for(const int n: nums){
            if(uset.count(n)){
                return true;
            }
            uset.insert(n);
        }
        return false;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
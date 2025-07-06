#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class FindSumPairs {
   public:
    vector<int> v1, v2;
    unordered_map<int, int> umap;

    FindSumPairs(vector<int>& nums1, vector<int>& nums2) {
        v1 = nums1, v2 = nums2;
        std::sort(v1.begin(), v1.end());
        for (int n : v2)
            ++umap[n];
    }

    void add(int index, int val) {
        --umap[v2[index]];
        v2[index] += val;
        ++umap[v2[index]];
    }

    int count(int tot) {
        int res = 0;
        for (int n : v1) {
            if (n >= tot)
                break;
            res += umap[tot - n];
        }
        return res;
    }
};

/**
 * Time Complexity
 * FindSumPairs: O(N1 log N1 + N2) on average
 * add: O(1) on average. Worst case O(U2), where U2 is the number of unique elements in nums2.
 * count: O(N1) on average. Worst case O(N1 * U2).
 */
// Space Complexity: O(N1+N2)

/**
 * Your FindSumPairs object will be instantiated and called as such:
 * FindSumPairs* obj = new FindSumPairs(nums1, nums2);
 * obj->add(index,val);
 * int param_2 = obj->count(tot);
 */
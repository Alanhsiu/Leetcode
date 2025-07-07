#include <vector>
#include <algorithm>
using namespace std;

class Solution {
   public:
    int MAX = 1e7;
    int findKthMin(vector<int>& nums1, int start1, vector<int>& nums2, int start2, int k) {
        if (nums1.size() - start1 == 0)
            return nums2[start2 + k - 1];
        if (nums2.size() - start2 == 0)
            return nums1[start1 + k - 1];
        if (k == 1)
            return std::min(nums1[start1], nums2[start2]);

        int idx1 = start1 + k / 2 - 1;
        int idx2 = start2 + k / 2 - 1;
        int val1 = (idx1 < nums1.size()) ? nums1[idx1] : MAX;
        int val2 = (idx2 < nums2.size()) ? nums2[idx2] : MAX;

        if (val1 < val2)
            return findKthMin(nums1, idx1 + 1, nums2, start2, k - k / 2);
        return findKthMin(nums1, start1, nums2, idx2 + 1, k - k / 2);
    }
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // use binary tree to solve the problem
        int m = nums1.size();
        int n = nums2.size();

        int k = (m + n + 1) / 2;
        int med = findKthMin(nums1, 0, nums2, 0, k);  // k is 1-index

        bool isOdd = (m + n) % 2;
        if (isOdd)
            return med;
        else
            return (med + findKthMin(nums1, 0, nums2, 0, k + 1)) / 2.0;
    }
};

// Time: O(log(m+n))
// Space: O(log(m+n))
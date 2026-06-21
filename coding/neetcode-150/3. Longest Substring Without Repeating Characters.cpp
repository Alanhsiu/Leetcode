#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
   public:
    int lengthOfLongestSubstring(string s) {
        int len = s.length();
        int maxLen = 0;
        unordered_map<char, int> umap;  // store the last seen index of each char
        int left = 0;

        for (int right = 0; right < len; ++right) {
            char cur = s[right];
            if (umap.count(cur) && umap[cur] >= left) {  // note that `umap[cur]>=left` is important to keep `left` not going back
                left = umap[cur] + 1;
            }
            maxLen = std::max(maxLen, right - left + 1);
            umap[cur] = right;
        }

        return maxLen;
    }
};

// Time: O(n) on average
// Space: O(1), since the size of ASCII code (256) is often consider constant.
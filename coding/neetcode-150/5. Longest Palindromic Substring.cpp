#include <algorithm>
#include <string>
using namespace std;

class Solution {
public:
  int expandAroundCenter(const string &s, int leftIdx, int rightIdx) {
    int strLen = s.length();
    while (leftIdx >= 0 && rightIdx < strLen && s[leftIdx] == s[rightIdx]) {
      leftIdx--;
      rightIdx++;
    }
    return rightIdx - leftIdx - 1;
  }
  string longestPalindrome(string s) {
    // there are two types of palindrome, odd-length and even-length
    int strLen = s.length();
    int maxLen = 1;
    int startOfMaxLen = 0;

    for (int i = 0; i < strLen; i++) {
      int len1 = expandAroundCenter(s, i, i);
      int len2 = expandAroundCenter(s, i, i + 1);
      int curLen = max(len1, len2);
      if (curLen > maxLen) {
        maxLen = curLen;
        startOfMaxLen = i - (curLen - 1) / 2;
      }
    }

    return s.substr(startOfMaxLen, maxLen);
  }
};

// Time: O(n^2)
// Space: O(1)
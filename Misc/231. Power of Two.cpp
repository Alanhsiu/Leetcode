class Solution {
public:
    bool isPowerOfTwo(int n) {
        // if n is 2^k, then only 1 bit is 1
        return n>0 && (n&(n-1))==0;
    }
};

// Time Complexity: O(1)
// Space Complexity: O(1)
class Solution {
public:
    int hammingWeight(int n) {
        int count=0;
        while(n>0){
            if(n&1>0){
                ++count;
            }
            n>>=1;
        }

        return count;
    }
};

// Time Complexity: O(1), since the number of 1 bits is at most 32.
// Space Complexity: O(1)
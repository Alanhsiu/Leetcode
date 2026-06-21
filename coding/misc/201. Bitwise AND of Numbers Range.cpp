class Solution {
public:
    int rangeBitwiseAnd(int left, int right) {
        // 101 (left)
        // 111 (right)
        // 100 (find the common prefix)

        unsigned short shift=0;
        while(left<right){
            left>>=1;
            right>>=1;
            ++shift;
        }

        return left<<shift;
    }
};
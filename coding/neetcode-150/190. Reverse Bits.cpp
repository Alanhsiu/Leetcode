class Solution {
public:
    int reverseBits(int n) {
        int res=0;
        
        for(int i=0; i<32; ++i){
            if(n==0){
                break; 
            }
            if(n&1){
                res+=(1<<(31-i));
            }
            n>>=1;
        }

        return res;
    }
};

// Time Complexity: O(1)
// Space Complexity: O(1)
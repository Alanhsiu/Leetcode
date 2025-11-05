class Solution {
public:
    double myPow(double x, int n) {
        if(x==1 || n==0)
            return 1.0;
        if(x==-1)
            return (n%2)?-1.0:1.0;

        double res=1;
        long N=n;
        if(N<0){
            x=1.0/x;
            N=-N;
        }

        // 2^10 = 4^5 = 4^4 * 4 = 16^2 * 4 = 256*4
        while(N>1){
            if(N&1){
                res*=x;
            }
            x*=x;
            N>>=1;
        }
        res*=x;

        return res;
    }
};

// Time Complexity: O(log n)
// Space Complexity: O(1)
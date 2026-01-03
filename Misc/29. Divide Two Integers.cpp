class Solution {
public:
    int divide(int dividend, int divisor) {
        if(dividend==INT_MIN && divisor==-1){
            return INT_MAX;
        }

        bool isNegative=(dividend>0)^(divisor>0);
        long long a=abs((long long)dividend);
        long long b=abs((long long)divisor);
        long long quotient=0;

        while(a>=b){
            long long tmp=b;
            int shift=0;
            while((tmp<<1)<a){
                tmp<<=1;
                ++shift;
            }
            a-=tmp;
            quotient+=(1<<shift);
        }

        return isNegative? -quotient: quotient;
    }
};

// Time Complexity: O(log(dividend/divisor))
// Space Complexity: O(1)
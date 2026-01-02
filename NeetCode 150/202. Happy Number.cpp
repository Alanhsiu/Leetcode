class Solution {
public:
    bool isHappy(int n) {
        // loop this:
        // 1. extract each digits
        // 2. get the sum
        // 3. check if the sum==1

        // 2^31 -> 1000^3 -> 1e9 (approx)
        // use 10 digit to be upper bound
        // max: 9^2 * 10 = 810 -> max loop number
        // the other methods are to use hash set or two pointer

        for(int i=0; i<810; ++i){
            int sum=0;
            while(n!=0){
                int digit=n%10;
                n/=10;
                sum+=(digit*digit);
            }
            if(sum==1){
                return true;
            }
            n=sum;
        }

        return false;
    }
};

// Time: O(1)
// Space: O(1)
class Solution {
public:
    int mySqrt(int x) {
        if(x<2){
            return x;
        }
        int left=2;
        int right=x/2;

        while(left<=right){
            int mid=left+(right-left)/2;
            if(x/mid>mid){
                left=mid+1;
            }
            else if(x/mid<mid){
                right=mid-1;
            }
            else{
                return mid;
            }
        }
        return right;
    }
};

// Time Complexity: O(log x)
// Space Complexity: O(1)
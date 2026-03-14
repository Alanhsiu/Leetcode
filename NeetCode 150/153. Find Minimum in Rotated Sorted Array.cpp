#include <vector>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {

        int l=0, r=nums.size()-1;
        while(l<r){
            int lval=nums[l];
            int rval=nums[r];

            if(lval<rval){
                return lval;
            }

            int mid=(l+r)/2;
            if(nums[mid]>=lval){
                l=mid+1;
            }
            else{
                r=mid;
            }
        }

        return nums[l];
    }
};

// Time: O(log n)
// Space: O(1)
#include <vector>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left=0;
        int right=nums.size()-1;

        while(left<=right){
            int mid=(left+right)/2;
            if(nums[mid]==target){
                return mid;
            }
            else if(nums[mid]>target){
                right=mid-1;
            }
            else{
                left=mid+1;
            }
        }

        return left;

    }
};

// nums = [1,3,5,6], target = 5
// l=0 -> 2
// r=3
// mid=1 -> 2

// nums = [1,3,5,6], target = 2
// l=0
// r=3 -> 0
// mid=1 -> 0

// Time Complexity: O(logN)
// Space Complexity: O(1)


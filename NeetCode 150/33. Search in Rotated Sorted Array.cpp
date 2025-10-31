class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left=0, right=nums.size()-1;

        while(left<=right){
            int mid=(left+right)/2;

            if(nums[mid]==target){
                return mid;
            }
            else if(nums[left]<=nums[mid]){ // left side sorted
                if(nums[left]<=target && nums[mid]>target)
                    right=mid-1;
                else
                    left=mid+1;
            }
            else{ // right side sorted
                if(nums[mid]<target && nums[right]>=target)
                    left=mid+1;
                else
                    right=mid-1;
            }
        }

        return -1;
    }
};

// Time Complexity: O(log n)
// Space Complexity: O(1)
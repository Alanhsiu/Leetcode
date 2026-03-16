#include <vector>
using namespace std;

class Solution {
public:
    int quickSelect(vector<int>& nums, int l, int r) {
        int randomIdx=std::rand()%(r-l+1)+l;
        swap(nums[randomIdx], nums[r]);
        int pivot=nums[r];
        int i=l;
        for(int j=l; j<r; ++j){
            if(nums[j]>pivot){
                swap(nums[i], nums[j]); // keep larger nums at the left
                ++i;
            }
        }
        swap(nums[i], nums[r]);
        return i;
    }
    int findKthLargest(vector<int>& nums, int k) {
        srand(time(NULL));
        
        int n=nums.size();
        int target=k-1;

        int l=0, r=n-1;
        while(l<=r){
            int pidx=quickSelect(nums, l, r);
            if(pidx==target){
                return nums[pidx];
            }
            else if(pidx<target){
                l=pidx+1;
            }
            else{ // p>target
                r=pidx-1;
            }
        }

        return nums[l];
    }
};

// Time Complexity: O(N) on average, O(N^2) in the worst case (when the smallest or largest element is always chosen as the pivot).
// Space Complexity: O(1) for the in-place partitioning.
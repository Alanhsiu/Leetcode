class Solution {
public:
    int maxArea(vector<int>& height) {
        int numOfLines=height.size();
        int left=0;
        int right=numOfLines-1;
        int maxWater=0;

        while(right>left){
            maxWater=max(maxWater, (right-left)*min(height[left], height[right]));
            if(height[right]<height[left])
                right--;
            else
                left++;
        }

        return maxWater;
    }
};

// Time: O(N)
// Space: O(1)
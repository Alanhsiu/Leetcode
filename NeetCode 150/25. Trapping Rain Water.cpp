class Solution {
public:
    int trap(vector<int>& height) {
        int n=height.size();
        int left=0, right=n-1;
        int maxLeft=height[0], maxRight=height[n-1];
        int sum=0;

        if(n<=2)
            return 0;

        while(left<right){
            if(maxLeft<maxRight){
                int cur=maxLeft-height[left];
                if(cur>0)
                    sum+=cur;
                ++left;
            }
            else{ // maxLeft>=maxRight
                int cur=maxRight-height[right];
                if(cur>0)
                    sum+=cur;
                --right;
            }
            maxLeft=std::max(maxLeft,height[left]);
            maxRight=std::max(maxRight,height[right]);
        }

        return sum;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
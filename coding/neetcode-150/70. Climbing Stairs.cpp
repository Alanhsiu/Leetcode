class Solution {
public:
    int climbStairs(int n) {
        vector<int> res(n+1, 0);
        if(n==1)
            return 1;
            
        res[1]=1;
        res[2]=2;

        for(int i=3; i<=n; ++i){
            res[i]=res[i-1]+res[i-2];
        }

        return res[n];
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
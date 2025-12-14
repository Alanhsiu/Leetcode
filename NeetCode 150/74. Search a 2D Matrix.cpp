class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m=matrix.size();
        int n=matrix[0].size();
        
        // do 2 binary searchs
        int top=0;
        int down=m-1;
        
        int targetRow=-1;
        while(top<=down){
            int mid=(top+down)/2;
            int val=matrix[mid][0];
            if(val==target){
                return true;
            }
            else if(val<target){
                targetRow=mid; // temporarily keep it
                top=mid+1;
            }
            else{
                down=mid-1;
            }
        }

        if(targetRow==-1){
            return false;
        }

        int left=0;
        int right=n-1;

        while(left<=right){
            int mid=(left+right)/2;
            int val=matrix[targetRow][mid];
            if(val==target){
                return true;
            }
            if(val<target){
                left=mid+1;
            }
            else{
                right=mid-1;
            }
        }

        return false;
    }
};

// Time Complexity: O(log m + log n)=O(log mn)
// Space Complexity: O(1)
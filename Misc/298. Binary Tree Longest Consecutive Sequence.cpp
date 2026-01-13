/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    void dfs(TreeNode* root, int pVal, int curLen, int& curMax){
        if(!root){
            return;
        }
        int rVal=root->val;
        if(rVal==pVal+1){
            curLen+=1;
        }
        else{
            curLen=1;
        }
        curMax=std::max(curMax, curLen);
        dfs(root->left, rVal, curLen, curMax);
        dfs(root->right, rVal, curLen, curMax);
    }
    int longestConsecutive(TreeNode* root) {
        int curMax=0;
        dfs(root, root->val-1, 0, curMax);
        return curMax;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H) where H is the height of the tree
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
    bool dfs(TreeNode* root, TreeNode* low, TreeNode* high){
        if(!root){
            return true;
        }
        if((high && root->val>=high->val) || (low && root->val<=low->val)){
            return false;
        }
        return dfs(root->left, low, root) && dfs(root->right, root, high);
    }
    bool isValidBST(TreeNode* root) {
        return dfs(root, nullptr, nullptr);
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H) where H is the height of the tree, since we are using recursion (the call stack will take up space). 
// In the worst case (skewed tree), H = N. In the best case (balanced tree), H = log(N).
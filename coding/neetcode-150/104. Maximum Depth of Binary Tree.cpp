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
    int maxDepth(TreeNode* root) {
        if(!root) return 0;
        return max(maxDepth(root->left), maxDepth(root->right))+1;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H) where H is the height of the tree, since we are using recursion (the call stack will take up space). 
// In the worst case (skewed tree), H = N. In the best case (balanced tree), H = log(N).
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
    bool isIdentical(TreeNode* root, TreeNode* subRoot){
        if(!root && !subRoot){
            return true;
        }
        if(!root || !subRoot || root->val != subRoot->val){
            return false;
        }
        return isIdentical(root->left, subRoot->left) && isIdentical(root->right, subRoot->right);
    }
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        return isIdentical(root, subRoot) || (root && (isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot)));
    }
};

// Time Complexity: O(N*M)
// Space Complexity: O(H) where H is the height of the tree, since we are using recursion (the call stack will take up space). 
// In the worst case (skewed tree), H = N. In the best case (balanced tree), H = log(N).
// We can use preorder traversal and serialize the tree to a string, then check if the subtree is a substring of the string, this will be O(N+M) time complexity.
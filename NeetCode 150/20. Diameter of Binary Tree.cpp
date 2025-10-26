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
    std::pair<int, int> dfs(TreeNode* root) { // return the depth and the diameter of the tree
        if(!root)
            return {0, 0};
        
        auto [leftDepth, leftDiameter] = dfs(root->left);
        auto [rightDepth, rightDiameter] = dfs(root->right);

        int diameterThroughRoot=leftDepth+rightDepth;
        
        int currentDiameter=std::max({leftDiameter, rightDiameter, diameterThroughRoot});
        int currentDepth=std::max(leftDepth, rightDepth)+1;
        
        return {currentDepth, currentDiameter};
    }
    int diameterOfBinaryTree(TreeNode* root) {
        return dfs(root).second;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H) where H is the height of the tree, since we are using recursion (the call stack will take up space). 
// In the worst case (skewed tree), H = N. In the best case (balanced tree), H = log(N).
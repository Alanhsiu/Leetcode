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
    std::pair<int, int> dfs(TreeNode* root){
        if(!root){
            return {-1001, -1001};
        }
        auto [l1, l2]=dfs(root->left);
        auto [r1, r2]=dfs(root->right);
        int v=root->val;
        int ableToConnect=std::max(std::max(l1, r1)+v, v);
        int notAbleToConnet=std::max(std::max(l2, r2), std::max(l1+r1+v, ableToConnect));
        return {ableToConnect, notAbleToConnet};
    }
    int maxPathSum(TreeNode* root) {
        auto [v1, v2]=dfs(root);
        return std::max(v1, v2);
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H), where H is the height of the tree due to recursion stack.
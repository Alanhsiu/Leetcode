// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    void solve(TreeNode* root, int& k, int& res) {
        if(!root){
            return;
        }
        solve(root->left, k, res);
        if(k==0){
            return;
        }
        if(--k==0){
            res=root->val;
            return;
        }
        solve(root->right, k, res);
    }
    int kthSmallest(TreeNode* root, int k) {
        int res=-1;
        solve(root, k, res);
        return res;
    }
};

// Time: O(H+k), where H is the height of the tree, since we may need to traverse down to the leftmost node and then visit k nodes.
// Space: O(H), where H is the height of the tree, due to the recursionn stack. In the worst case of a skewed tree, this could be O(N).
#include <algorithm>

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};


class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        int minVal=std::min(p->val, q->val);
        int maxVal=std::max(p->val, q->val);

        while(root){
            if(root->val<minVal){
                root=root->right;
            }
            else if(root->val>maxVal){
                root=root->left;
            }
            else{
                return root;
            }
        }
        return nullptr;
    }
};

// Time: O(H), where H is the height of the tree, since in the worst case we might have to traverse from the root to a leaf node.
// Space: O(1), since we are using only a constant amount of extra space.
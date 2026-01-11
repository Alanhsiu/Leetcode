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
    unordered_map<int, int> umap;
    TreeNode* traversal(const vector<int>& preorder, const vector<int>& inorder, int l1, int r1, int l2, int r2) {
        if(l1>r1){
            return nullptr;
        }

        int val=preorder[l1];
        TreeNode* root=new TreeNode(val);
        int m=umap[val]; // idx in inorder
        // left tree size: m-l2
        int llen=m-l2;
        root->left=traversal(preorder, inorder, l1+1, l1+llen, l2, m-1);
        root->right=traversal(preorder, inorder, l1+llen+1, r1, m+1, r2);
        return root;
    }

    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        int len=preorder.size();

        for(int i=0; i<len; ++i){
            umap[inorder[i]]=i;
        }
        
        return traversal(preorder, inorder, 0, len-1, 0, len-1);
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
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
    int goodNodes(TreeNode* root) {
        return dfs(root, root->val);
    }
    int dfs(TreeNode* curNode, int maxValue){
        int count=0;
        if(!curNode)
            return 0;
        if(curNode->val>=maxValue){
            maxValue=curNode->val;
            count++;
        }
        count+=dfs(curNode->left, maxValue);
        count+=dfs(curNode->right, maxValue);

        return count;
    }
};

// Time: O(n)
// Space: O(h) where h is the height of the tree, since we are using recursion (the call stack will take up space). 
// In the worst case (skewed tree), h = n. In the best case (balanced tree), h = log(n).
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
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> res;
        if(!root){
            return res;
        }
        queue<TreeNode*> q;
        q.push(root);

        vector<int> curLevel;
        while(!q.empty()){
            int levelSize=q.size();
            curLevel.clear();
            for(int i=0; i<levelSize; ++i){
                TreeNode* curNode=q.front();
                curLevel.push_back(curNode->val);
                if(curNode->left){
                    q.push(curNode->left);
                }
                if(curNode->right){
                    q.push(curNode->right);
                }
                q.pop();
            }
            res.push_back(curLevel);
        }
        return res;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(W) for the queue, where W is the maximum width of the tree.
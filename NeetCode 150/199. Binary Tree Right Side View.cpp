#include <vector>
using namespace std;

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
    void dfs(TreeNode* root, vector<int>& res, int level){
        if(!root){
            return;
        }
        if(level==res.size()){
            res.push_back(root->val);
        }
        dfs(root->right, res, level+1);
        dfs(root->left, res, level+1);
    }
    vector<int> rightSideView(TreeNode* root) {
        vector<int> res;
        dfs(root, res, 0);
        return res;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H), where H is the height of the binary tree, which is O(N) in the worst case (skewed tree) and O(log N) in the best case (balanced tree).
#include <queue>
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
    int minDepth(TreeNode* root) {
        if(!root){
            return 0;
        }
        
        std::queue<pair<TreeNode*, int>> q;
        q.push({root, 1});

        while(!q.empty()){
            auto [node, depth]=q.front();
            q.pop();

            if(!node->left && !node->right){
                return depth;
            }
            if(node->left){
                q.push({node->left, depth+1});
            }
            if(node->right){
                q.push({node->right, depth+1});
            }
        }

        return 0;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(H) where H is the height of the tree. In the worst case (skewed tree), it can be O(N).
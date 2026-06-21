/*
// Definition for a Node.
class Node {
public:
int val;
vector<Node*> neighbors;
Node() {
    val = 0;
    neighbors = vector<Node*>();
}
Node(int _val) {
    val = _val;
    neighbors = vector<Node*>();
}
Node(int _val, vector<Node*> _neighbors) {
    val = _val;
    neighbors = _neighbors;
}
};
*/

class Solution {
public:
    unordered_map<Node*, Node*> umap; // original node -> cloned node
    Node* cloneGraph(Node* node) {
        if(!node){
            return nullptr;
        }
        auto it=umap.find(node);
        if(it!=umap.end()){
            return it->second;
        }

        Node* root=new Node(node->val);
        umap[node]=root;

        for(auto& n: node->neighbors){
            root->neighbors.push_back(cloneGraph(n));
        }

        return root;
    }
};

// Time Complexity: O(V + E), V is the number of nodes, E is the number of edges
// Space Complexity: O(V) for the hashmap and recursion stack
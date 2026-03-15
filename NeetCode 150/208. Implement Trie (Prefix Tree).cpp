#include <string>
using namespace std;

class TrieNode {
public:
    bool isWord;
    TrieNode *child[26];
    TrieNode(){
        isWord=false;
        for(auto &a: child)
            a=nullptr;
    }
};
class Trie {
public:
    Trie() {
        root = new TrieNode();
    }
    
    void insert(string word) {
        TrieNode* p=root;
        for(auto &a: word){
            int i=a-'a';
            if(!p->child[i])
                p->child[i]=new TrieNode();
            p=p->child[i];
        }
        p->isWord=true;
    }
    
    bool search(string word) {
        TrieNode* p=root;
        for(auto &a: word){
            int i=a-'a';
            if(!p->child[i])
                return false;
            p=p->child[i];
        }
        return p->isWord;
    }
    
    bool startsWith(string prefix) {
        TrieNode *p = root;
        for (auto &a: prefix)
        {
            int i = a - 'a';
            if(!p->child[i])
                return false;
            p=p->child[i];
        }
        
        return true;
    }

private:
    TrieNode* root;
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */

// Time Complexity: O(m) for insert, search, and startsWith, where m is the length of the input string (word or prefix).
// Space Complexity: O(m) for insert, since we may need to create up to m new TrieNodes in the worst case. The space complexity for search and startsWith is O(1) since they only use a constant amount of extra space.
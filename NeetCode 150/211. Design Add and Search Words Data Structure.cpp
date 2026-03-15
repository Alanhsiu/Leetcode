#include <string>
using namespace std;

class TrieNode {
public:    
    TrieNode* children[26];
    bool isEnd;

    TrieNode(){
        for(auto& c: children){
            c=nullptr;
        }
        isEnd=false;
    }
};
class WordDictionary {
public:
    WordDictionary() {
        root=new TrieNode();
    }
    ~WordDictionary(){
        clear(root);
    }
    
    void addWord(string word) {
        TrieNode* cur=root;
        for(const char &c: word){
            int i=c-'a';
            if(!cur->children[i]){
                cur->children[i]=new TrieNode();
            }
            cur=cur->children[i];
        }
        cur->isEnd=true;
    }
    
    bool search(string word) {
       return dfs(root, word, 0);
    }

private:
    TrieNode* root;

    bool dfs(TrieNode* cur, const string& word, int idx){
        if(idx==word.size()){
            return cur->isEnd;
        }
        char c=word[idx];
        if(c=='.'){
            for(int i=0; i<26; ++i){
                if(cur->children[i] && dfs(cur->children[i], word, idx+1)){
                    return true;
                }
            }
            return false;
        }
        int i=c-'a';
        if(!cur->children[i]){
            return false;
        }
        return dfs(cur->children[i], word, idx+1);
    }

    void clear(TrieNode* node){
        if(!node){
            return;
        }
        for(auto c: node->children){
            if(c){
                clear(c);
            }
        }
        delete node;
    }
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * WordDictionary* obj = new WordDictionary();
 * obj->addWord(word);
 * bool param_2 = obj->search(word);
 */

// Time Complexity: O(m) for addWord and search, where m is the length of the input word. In the worst case, search can take O(26^m) time if the word consists of '.' characters and matches all possible combinations of letters.
// Space Complexity: O(m) for addWord, since we may need to create up to m new TrieNodes in the worst case. The space complexity for search is O(m) due to the recursion stack in the worst case when the word consists of '.' characters.
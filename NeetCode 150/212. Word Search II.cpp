#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    struct TrieNode {
        TrieNode* children[26]={nullptr};
        // unique_ptr<TrieNode> children[26];
        string* word=nullptr;

        ~TrieNode(){
            for(int i=0; i<26; ++i){
                if(children[i]){
                    delete children[i];
                }
            }
        }
    };

    void insert(TrieNode* root, string& s){
        TrieNode* cur=root;
        for(char c: s){
            if(cur->children[c-'a']==nullptr){
                cur->children[c-'a']=new TrieNode();
            }
            cur=cur->children[c-'a'];
        }
        cur->word=&s;
    }

    void dfs(vector<vector<char>>& board, vector<string>& res, TrieNode* cur, int x, int y){
        if(x<0 || x>=board.size() || y<0 || y>=board[0].size()){
            return;
        }

        char c=board[x][y];
        if(c=='#' || !cur->children[c-'a']){
            return;
        }

        cur=cur->children[c-'a'];
        if(cur->word){
            res.push_back(*cur->word);
            cur->word=nullptr;
        }

        board[x][y]='#';
        int dx[4]={-1, 1, 0, 0};
        int dy[4]={0, 0, -1, 1};
        for(int i=0; i<4; ++i){
            dfs(board, res, cur, x+dx[i], y+dy[i]);
        }
        board[x][y]=c;
    }
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        vector<string> res;

        TrieNode* root=new TrieNode();
        for(string& word: words){
            insert(root, word);
        }
        
        for(int x=0; x<board.size(); ++x){
            for(int y=0; y<board[0].size(); ++y){
                dfs(board, res, root, x, y);
            }
        }

        delete root;

        return res;
    }
};

// Time Complexity: O(S + M*N*3^L) where S is the total number of letters in the words, M and N are the dimensions of the board, and L is the maximum length of a word.
//                  O(S) to build the Trie, and O(M*N*3^L) for the DFS search.
// Space Complexity: O(S)
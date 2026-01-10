class Solution {
public:
    bool dfs(vector<vector<char>>& board, const string& word, int wordIdx, int x, int y){
        if(wordIdx==word.length()){
            return true;
        }
        if(x<0 || x>=board.size() || y<0 || y>=board[0].size() || board[x][y]!=word[wordIdx]){
            return false;
        }

        char tmp=board[x][y];
        board[x][y]='#';
        int dx[]={-1, 1, 0, 0};
        int dy[]={0, 0, 1, -1};

        for(int i=0; i<4; ++i){
            if(dfs(board, word, wordIdx+1, x+dx[i], y+dy[i])){
                return true;
            }
        }
        board[x][y]=tmp;
        return false;
    }
    bool exist(vector<vector<char>>& board, string word) {
        int m=board.size();
        int n=board[0].size();
        for(int i=0; i<m; ++i){
            for(int j=0; j<n; ++j){
                if(dfs(board, word, 0, i, j)){
                    return true;
                }
            }
        }
        return false;
    }
};

// Time Complexity: O(M*N*4^L), where M is the number of rows, N is the number of columns, and L is the length of the word.
// Space Complexity: O(L), where L is the length of the word.
// The space complexity is due to the recursion stack.
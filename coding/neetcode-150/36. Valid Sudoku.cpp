class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        std::unordered_set<char> uset; 

        // search rows
        for(int row=0; row<9; ++row){
            for(int col=0; col<9; ++col){
                char c=board[row][col];
                if(c=='.')
                    continue;
                else if(uset.count(c))
                    return false;
                else
                    uset.insert(c);
            }
            uset.clear();
        }

        // search cols
        for(int col=0; col<9; ++col){
            for(int row=0; row<9; ++row){
                char c=board[row][col];
                if(c=='.')
                    continue;
                else if(uset.count(c))
                    return false;
                else
                    uset.insert(c);
            }
            uset.clear();
        }

        // search grids
        for(int i=0; i<3; ++i){
            for(int j=0; j<3; ++j){
                for(int row=0; row<3; ++row){
                    for(int col=0; col<3; ++col){
                        char c=board[i*3+row][j*3+col];
                        if(c=='.')
                            continue;
                        else if(uset.count(c))
                            return false;
                        else
                            uset.insert(c);
                    }
                }
                uset.clear();
            }
        }

        return true;
    }
};

// Time Complexity: O(1), since the board size is fixed (9x9).
// Space Complexity: O(1), since the maximum size of the hash set is limited to 9 elements for each row, column, or grid.
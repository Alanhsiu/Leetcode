class Solution {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        backtrack(result, "", n, 0, 0);

        return result;
    }

    void backtrack(vector<string>& result, string current, int n, int leftNum, int rightNum){
        if(current.length()==2*n){
            result.push_back(current);
            return;
        }

        if(leftNum<n){
            current.push_back('(');
            backtrack(result, current, n, leftNum+1, rightNum);
            current.pop_back();
        }
        
        if(rightNum<leftNum){
            current.push_back(')');
            backtrack(result, current, n, leftNum, rightNum+1);
            current.pop_back();
        }

        return;
    }
};

// Time Complexity: O(4^N / sqrt(N)), or O(n*C_n) where C_n is the n-th Catalan number.
// Space Complexity: O(N) for auxiliary space, O(4^N / sqrt(N)) for the result.
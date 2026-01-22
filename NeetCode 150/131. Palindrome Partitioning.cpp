class Solution {
public:
    vector<vector<bool>> pal;
    void dfs(vector<vector<string>>& res, vector<string>& cur, string&s, int start){
        if(start==s.length()){
            res.push_back(cur);
            return;
        }
        for(int end=start; end<s.length(); ++end){
            if(pal[start][end]){
                cur.push_back(s.substr(start, end-start+1));
                dfs(res, cur, s, end+1);
                cur.pop_back();
            }
        }
    }
    void expansion(const string& s, int i, int j){
        if(i>=0 && j<s.length() && s[i]==s[j]){ // i <= j
            pal[i][j]=true;
            expansion(s, i-1, j+1);
        }
    }
    vector<vector<string>> partition(string s) {
        // preprocess: create a lookup table to check palindrome
        int len=s.length();
        pal.resize(len, vector<bool>(len, false)); // pal[i][j]: s[i...j] is pal or not
        
        // use center expansion method
        for(int i=0; i<len; ++i){
            expansion(s, i, i);
            expansion(s, i, i+1);
        }

        // dfs to get the result 
        vector<vector<string>> res;
        vector<string> cur;
        dfs(res, cur, s, 0);
        return res;
    }
};

// Time Complexity: O(N * 2^N). 2^N for generating all partitions, O(N) for copying substring to current partition
// Space Complexity: O(N^2) for palindrome lookup table + O(N) for current partition recursion stack
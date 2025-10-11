class Solution {
public:
    vector<string> digitsMap={"abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> letterCombinations(string digits) {
        vector<string> result;
        if(digits.length()==0)
            return result;

        string path="";
        DFS(result, path, digits, 0);
        return result;
    }

    void DFS(vector<string>& result, string& path, string& digits, int index) {
        if(index==digits.length()){
            result.push_back(path);
            return;
        }

        string& letters=digitsMap[digits[index]-'2'];
        for(char c: letters){
            path.push_back(c);
            DFS(result, path, digits, index+1);
            path.pop_back();
        }
    }
};

// Time Complexity: O(4^N), but O(4^N * N) for copying the path to the result.
// Space Complexity: O(N), here we only consider the space of auxiliary space. When considering the space of the result, it is O(4^N * N).
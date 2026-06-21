class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        std::unordered_map<string, vector<string>> umap;
        for(const string& s: strs){
            string t=s;
            sort(t.begin(), t.end());
            umap[t].push_back(s);
        }

        vector<vector<string>> res;
        for(const auto p: umap){
            res.push_back(p.second);
        }

        return res;
    }
};

// Time Complexity: O(N * K log K) where N is the number of strings and K is the maximum length of a string
// Space Complexity: O(N * K)
class Solution {
public:
    int countBinarySubstrings(string s) {
        vector<int> groups;
        char prev=s[0];
        int count=0;
        int i=0;
        while(i<s.length()){
            while(s[i]==prev){
                ++count;
                ++i;
            }
            prev=s[i];
            groups.push_back(count);
            count=0;
        }

        int res=0;
        for(int i=0; i<groups.size()-1; ++i){
            res+=std::min(groups[i], groups[i+1]);
        }
        return res;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(n)
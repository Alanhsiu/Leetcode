#include <string>
using namespace std;

class Solution {
public:
    int expand(const string& s, int l, int r){
        int count=0;
        while(l>=0 && r<s.length() && s[l]==s[r]){
            ++count;
            --l;
            ++r;
        }
        return count;
    }
    int countSubstrings(string s) {
        int count=0;
        int len=s.length();
        for(int i=0; i<len; ++i){
            count+=expand(s, i, i);
            count+=expand(s, i, i+1);
        }
        return count;
    }
};

// Time Complexity: O(N^2)
// Space Complexity: O(1)
class Solution {
public:
    int numDecodings(string s) {

        int len=s.length();
        if(len==0 || s[0]=='0'){
            return 0;
        }

        int prev2=1;
        int prev1=1;

        for(int i=1; i<len; ++i){
            int cur=0;
            if(s[i]!='0'){
                cur+=prev1;
            }
            int twoDigits=stoi(s.substr(i-1, 2));
            if(twoDigits>=10 && twoDigits<=26){
                cur+=prev2;
            }
            prev2=prev1;
            prev1=cur;
            if(prev1==0){
                return 0;
            }
        }
        return prev1;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
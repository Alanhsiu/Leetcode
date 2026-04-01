#include <string>
using namespace std;

class Solution {
public:
    int calculate(string s) {
        long long res=0;
        long long cur=0;
        long long last=0;
        char op='+';

        for(int i=0; i<s.length(); ++i){
            char c=s[i];
            if(isdigit(c)){
                cur=cur*10+(c-'0');
            }

            if(c=='+' || c=='-' || c=='*'|| c=='/' || i==s.length()-1){
                if(op=='+'){
                    res+=last;
                    last=cur;
                }
                else if(op=='-'){
                    res+=last;
                    last=-cur;
                }
                else if(op=='*'){
                    last*=cur;
                }
                else if(op=='/'){
                    last/=cur;
                }
                cur=0;
                op=c;
            }
        }

        res+=last;

        return res;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
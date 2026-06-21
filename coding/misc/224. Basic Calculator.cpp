#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    int calculate(string s) {
        long long res=0;
        long long cur=0;
        int sign=1;
        stack<long long> st;

        for(const char c: s){
            if(isdigit(c)){
                cur=cur*10+(c-'0');
            }
            else if(c=='+'){
                res+=cur*sign;
                cur=0;
                sign=1;
            }
            else if(c=='-'){
                res+=cur*sign;
                cur=0;
                sign=-1;
            }
            else if(c=='('){
                st.push(res);
                st.push(sign);
                res=0;
                sign=1;
            }
            else if(c==')'){
                res+=cur*sign;
                cur=0;

                long long prev_sign=st.top();
                st.pop();
                long long prev_res=st.top();
                st.pop();

                res=prev_res+prev_sign*res;
            }
        }
        res+=sign*cur;
        return res;
    }
};

// Time: O(N)
// Space: O(N)
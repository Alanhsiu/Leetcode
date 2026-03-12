#include <vector>
#include <stack>

using namespace std;

class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        std::stack<int> st;
        for(const string& t: tokens){
            if(t=="+"){
                int a=st.top();
                st.pop();
                int b=st.top();
                st.pop();
                st.push(b+a);
            }
            else if(t=="-"){
                int a=st.top();
                st.pop();
                int b=st.top();
                st.pop();
                st.push(b-a);
            }
            else if(t=="*"){
                int a=st.top();
                st.pop();
                int b=st.top();
                st.pop();
                st.push(b*a);
            }
            else if(t=="/"){
                int a=st.top();
                st.pop();
                int b=st.top();
                st.pop();
                st.push(b/a);
            }
            else{
                st.push(std::stoi(t));
            }
        }
        return st.top();
    }
};

// Time Complexity: O(N)
// Space Complexity: O(N)
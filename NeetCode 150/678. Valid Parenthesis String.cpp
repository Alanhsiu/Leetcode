#include <string>
using namespace std;

class Solution {
public:
    bool checkValidString(string s) {
        int lmin=0;
        int lmax=0;

        for(const char c: s){
            if(c=='('){
                ++lmin;
                ++lmax;
            }
            else if(c==')'){
                --lmin;
                --lmax;
            }
            else{ // c=='*'
                --lmin;
                ++lmax;
            }

            if(lmax<0){
                return false;
            }

            if(lmin<0){
                lmin=0;
            }
        }
        return lmin==0;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
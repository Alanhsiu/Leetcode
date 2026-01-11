class Solution {
public:
    bool isAlphaNum(const char &c){
        if((c<='z' && c>='a')||(c<='Z' && c>='A')||(c<='9' && c>='0')){
            return true;
        }
        return false;
    }
    char toLowercase(const char &c){
        if(c<='Z' && c>='A'){
            return c-'A'+'a';
        }
        return c;
    }

    bool isPalindrome(string s) {
        int l=0, r=s.length();

        while(l<r){
            while(l<r && !isAlphaNum(s[l])){
                ++l;
            }
            while(l<r && !isAlphaNum(s[r])){
                --r;
            }

            if(toLowercase(s[l])!=toLowercase(s[r])){
                return false;
            }
            ++l;
            --r;
        }
        return true;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
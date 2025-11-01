class Solution {
public:
    string multiply(string num1, string num2) {
        
        if(num1=="0" || num2=="0")
            return "0";
        
        int n1=num1.size();
        int n2=num2.size();

        vector<int> res(n1+n2, 0);

        for(int i=n1-1; i>=0; i--){
            for(int j=n2-1; j>=0; j--){
                res[i+j+1]+=(num1[i]-'0')*(num2[j]-'0');
                if(res[i+j+1]>=10){
                    res[i+j]+=(res[i+j+1]/10);
                    res[i+j+1]%=10;
                }
            }
        }

        int start=0;
        while(start<res.size() && res[start]==0)
            ++start;

        string str;
        for(int i=start; i<n1+n2; i++)
            str.push_back(res[i]+'0');

        return str;
    }
};

// Time Complexity: O(M*N)
// Space Complexity: O(M+N)
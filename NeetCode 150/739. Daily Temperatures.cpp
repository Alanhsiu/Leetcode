#include <vector>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n=temperatures.size();
        vector<int> res(n, 0);
        vector<int> st;
        st.reserve(n);
        
        for(int i=0; i<n; ++i){
            int cur=temperatures[i];
            while(!st.empty() && temperatures[st.back()]<cur){
                res[st.back()]=i-st.back();
                st.pop_back();
            }
            st.push_back(i);
        }

        return res;
    }
};

// Time: O(N), where N is the length of the input array, since each index is pushed and popped at most once.
// Space: O(N), in the worst case when the input array is strictly decreasing, the stack will hold all indices, and the output array also takes O(N) space.
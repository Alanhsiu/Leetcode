class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int len=tasks.size();
        if(n==0){
            return len;
        }

        int freq[26]={0};
        for(const char& c: tasks){
            ++freq[c-'A'];
        }

        int max=INT_MIN;
        int max_count=0;
        for(int i=0; i<26; ++i){
            int cur=freq[i];
            if(cur>max){
                max=cur;
                max_count=1;
            }
            else if(cur==max){
                ++max_count;
            }
        }

        return std::max(len, (max-1)*(n+1)+max_count);
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
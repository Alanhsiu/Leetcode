class Solution {
public:
    string minWindow(string s, string t) {
        int len1=s.length();
        int len2=t.length();

        if(len1<len2){
            return "";
        }
        
        // record frequency in t
        // unordered_map<char, int> umap;
        vector<int> umap(256, 0);
        for(const char& c: t){
            ++umap[c];
        }
        // int matchCount=umap.size();
        int matchCount=0;
        for(const int& i: umap){
            if(i!=0){
                ++matchCount;
            }
        }

        // sliding window
        int left=0;
        int right=0;
        int curMinWindow=INT_MAX;
        int startIdx=0;
        
        while(right<len1){ 
            --umap[s[right]];
            if(umap[s[right]]==0){
                --matchCount;
            }

            while(matchCount==0){ // move left pointer
                if(right-left+1<curMinWindow){
                    curMinWindow=right-left+1;
                    startIdx=left;
                }
                if(++umap[s[left]]>0){
                    ++matchCount;
                }
                ++left;
            }

            ++right;
        }

        if(curMinWindow==INT_MAX){
            return "";
        }

        return s.substr(startIdx, curMinWindow);
    }
};

// Time Complexity: O(n)
// Space Complexity: O(1)
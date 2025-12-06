class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        unordered_map<int, int> umap; // may improve by using vector<int> (26, 0);
        int len1=s1.length();
        int len2=s2.length();

        if(len1>len2){
            return false;
        }

        // use hashmap to record char freq in s1
        for(const char& c: s1){
            ++umap[c];
        }

        // use matchCount to record if all the chars in this window are matched
        int matchCount=0;

        // keep a window to check
        int left=0;
        for(int right=0; right<len2; ++right){
            if(umap[s2[right]]>0){
                ++matchCount;
            }
            --umap[s2[right]];

            if(matchCount==len1){
                return true;
            }

            if(right-left+1==len1){
                ++umap[s2[left]];
                if(umap[s2[left]]>0){
                    --matchCount;
                }
                ++left;
            }
        }

        return false;

    }
};

// Time Complexity: O(n)
// Space Complexity: O(1), the number of entries in the hash map is at most 26.
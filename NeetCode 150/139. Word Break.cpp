struct TrieNode {
    TrieNode* children[26];
    bool isEnd=false;
};
class Solution {
    TrieNode* root=new TrieNode();
    void insert(const string& word){
        TrieNode* node=root;
        for(char c: word){
            if(!node->children[c-'a']){
                node->children[c-'a']=new TrieNode();
            }
            node=node->children[c-'a'];
        }
        node->isEnd=true;
    }
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        // uset: store words
        // dp[i]: dp[1...i] can be made up by words
        // maxWordLen
        // every time, we check dp[i-1]~dp[i-maxWordLen] exist in uset
        // return dp[len]
        
        // int len=s.length();
        // int maxWordLen=INT_MIN;

        // unordered_set<string_view> uset(wordDict.begin(), wordDict.end()); // n elements
        // vector<bool> dp(len+1, false);

        // for(const string& w: wordDict){
        //     maxWordLen=max(maxWordLen, (int)w.length());
        // }

        // dp[0]=true;
        // string_view sv(s);

        // for(int i=1; i<=len; ++i){
        //     for(int j=i-1; j>=0; --j){
        //         if(!dp[j] || i-j>maxWordLen){ // cur string len = i-j
        //             continue;
        //         }

        //         if(uset.count(sv.substr(j, i-j))){
        //             dp[i]=true;
        //             break;
        //         }
        //     }
        // }

        // return dp[len];

        int len=s.length();
        vector<bool> dp(len+1, false); 
        
        
        for(const string& w: wordDict){
            insert(w);
        }

        dp[0]=true;
        for(int i=0; i<len; ++i){
            if(!dp[i]){
                continue;
            }

            TrieNode* tmp=root;
            for(int j=i; j<len; ++j){
                int cur=s[j]-'a';
                if(!tmp->children[cur]){
                    break;
                }

                tmp=tmp->children[cur];
                if(tmp->isEnd){
                    dp[j+1]=true;
                }
            }
        }

        return dp[len];

    }
};

// Time Complexity: O(len * maxWordLen)
// Space Complexity: O(N) for dp array and O(M) for unordered_set
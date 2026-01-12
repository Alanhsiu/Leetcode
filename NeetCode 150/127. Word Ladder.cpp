class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        int len=wordList.size();
        unordered_set<string> notVisited(wordList.begin(), wordList.end());
        if(!notVisited.count(endWord)){
            return 0;
        }

        queue<string> q;
        q.push(beginWord);
        
        int dist=0;
        while(!q.empty()){
            ++dist;
            int qlen=q.size();

            for(int i=0; i<qlen; ++i){
                string cur=q.front();
                q.pop();
                if(cur==endWord){
                    return dist;
                }
                for(int i=0; i<cur.length(); ++i){
                    char originalChar=cur[i];
                    for(int j=0; j<26; ++j){
                        cur[i]='a'+j;
                        if(notVisited.count(cur)){
                            q.push(cur);
                            notVisited.erase(cur);
                        }
                    }
                    cur[i]=originalChar;
                }
            }
        }

        return 0;
    }
};

// Time Complexity: O(N * M * 26), N is the number of words in wordList, M is the length of each word
// Space Complexity: O(N)
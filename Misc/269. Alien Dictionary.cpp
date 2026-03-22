#include <string>
#include <vector>
#include <unordered_set>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    string alienOrder(vector<string>& words) {
        if(words.empty()){
            return "";
        }

        std::unordered_set<char> all_chars;
        for(const string& w: words){
            for(const char& c: w){
                all_chars.insert(c);
            }
        }

        // build inDegree
        std::unordered_map<char, int> inDegree;
        for(const char c: all_chars){
            inDegree[c]=0;
        }

        // build adj list
        std::unordered_map<char, std::unordered_set<char>> adj;
        for(int i=0; i<words.size()-1; ++i){
            const string& s1=words[i];
            const string& s2=words[i+1];

            int len1=s1.length();
            int len2=s2.length();

            bool foundDiff=false;
            for(int j=0; j<std::min(len1, len2); ++j){
                if(s1[j]!=s2[j]){
                    if(!adj[s1[j]].count(s2[j])){
                        adj[s1[j]].insert(s2[j]);
                        ++inDegree[s2[j]];
                    }
                    foundDiff=true;
                    break;
                }
            }
            if(!foundDiff && len1>len2){
                return "";
            }
        }

        // bfs
        string res="";
        queue<char> q;
        for(const auto& [ch, degree]: inDegree){
            if(degree==0){
                q.push(ch);
            }
        }

        while(!q.empty()){
            char u=q.front();
            q.pop();
            res+=u;
            for(char v: adj[u]){
                --inDegree[v];
                if(inDegree[v]==0){
                    q.push(v);
                }
            }
        }

        if(res.length()!=all_chars.size()){
            return "";
        }

        return res;

    }
};

// Time Complexity: O(C) where C is the total number of characters in all words. We need to iterate through all characters to build the graph and perform BFS.
// Space Complexity: O(U+E) where U is the number of unique characters and E is the number of edges in the graph. We need space to store the graph and the in-degree of each character.
// But it's bound by 26^2, so we can consider it O(1) in terms of space complexity.
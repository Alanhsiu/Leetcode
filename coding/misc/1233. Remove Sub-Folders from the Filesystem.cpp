#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<string> removeSubfolders(vector<string>& folder) {
        sort(folder.begin(), folder.end());

        vector<string> res;
        res.push_back(folder[0]);
        for(int i=1; i<folder.size(); ++i){
            string s=folder[i];
            string lastFolder=res.back();
            lastFolder.push_back('/');

            if(s.compare(0, lastFolder.size(), lastFolder)!=0){
                res.push_back(s);
            }
        }

        return res;
    }
};

// Time Complexity: O(NlogN) for sorting the input vector, where N is the number of folders. The rest of the operations are O(N) for iterating through the sorted list.
// Space Complexity: O(N) for storing the result vector
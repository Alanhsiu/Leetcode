class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> uset(nums.begin(), nums.end());
        int maxSeqLength=0; // longest consecutive sequence

        for(const int& n: uset){
            if(!uset.count(n-1)){
                int curSeqLength=1;
                int curNum=n+1;
                while(uset.count(curNum)){
                    ++curNum;
                    ++curSeqLength;
                }
                maxSeqLength=std::max(maxSeqLength, curSeqLength);
            }
        }

        return maxSeqLength;
    }
};

// Time Complexity: O(n)
// Space Complexity: O(n)
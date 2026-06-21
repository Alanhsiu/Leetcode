
class Solution {
private:
    mt19937 gen{random_device{}()};
    
    vector<int> original;
    int n;

public:
    Solution(vector<int>& nums): original(nums), n(nums.size()) {}
    
    vector<int> reset() {
        return original;
    }
    
    vector<int> shuffle() {
        vector<int> res=original;
        for(int i=0; i<n; ++i){
            uniform_int_distribution<int> dist(i, n-1);
            swap(res[i], res[dist(gen)]);
        }
        return res;
    }
};

/**
 * Your Solution object will be instantiated and called as such:
 * Solution* obj = new Solution(nums);
 * vector<int> param_1 = obj->reset();
 * vector<int> param_2 = obj->shuffle();
 */
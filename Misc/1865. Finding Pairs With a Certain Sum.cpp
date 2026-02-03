class FindSumPairs {
public:
    vector<int> v1, v2;
    unordered_map<int, int> umap1, umap2;

    FindSumPairs(vector<int>& nums1, vector<int>& nums2): v1(nums1), v2(nums2) {
        for(const int n: v1){
            ++umap1[n];
        }
        for(const int n: v2){
            ++umap2[n];
        }
    }
    
    void add(int index, int val) {
        --umap2[v2[index]];
        v2[index]+=val;
        ++umap2[v2[index]];
    }
    
    int count(int tot) {
        int res=0;
        for(auto const& [num, freq]: umap1){
            res+=freq*(umap2[tot-num]);
        }
        return res;
    }
};

// 
// Time Complexity
// FindSumPairs: O(N1 + N2) on average
// add: O(1) on average
// count: O(U1) on average, where U1 is the number of unique elements in nums1
// 
// Space Complexity: O(N1+N2)

/**
 * Your FindSumPairs object will be instantiated and called as such:
 * FindSumPairs* obj = new FindSumPairs(nums1, nums2);
 * obj->add(index,val);
 * int param_2 = obj->count(tot);
 */
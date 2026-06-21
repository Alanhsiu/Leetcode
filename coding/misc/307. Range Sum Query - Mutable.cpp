class NumArray {
public:
    NumArray(vector<int>& nums) {
        N=nums.size();
        tree.resize(N*4, 0);
        buildTree(nums, 1, 0, N-1);
    }
    
    void update(int index, int val) {
        updateTree(1, 0, N-1, index, val);
    }
    
    int sumRange(int left, int right) {
        return getSum(1, 0, N-1, left, right);
    }

private:
    vector<int> tree; // the index of root node is 1
    int N; // N is the size of the nums

    void buildTree(vector<int>& nums, int treeIdx, int start, int end) {
        if(start==end) {
            tree[treeIdx]=nums[start];
            return;
        }

        int mid=(start+end)/2;
        
        buildTree(nums, treeIdx*2, start, mid);
        buildTree(nums, treeIdx*2+1, mid+1, end);

        tree[treeIdx]=tree[treeIdx*2]+tree[treeIdx*2+1];
    }

    int getSum(int treeIdx, int curLeft, int curRight, int targetLeft, int targetRight) {
        if (curLeft>=targetLeft && curRight<= targetRight)
            return tree[treeIdx];
        else if (curRight<targetLeft || curLeft>targetRight)
            return 0;
        else {
            int mid=(curLeft+curRight)/2;
            return getSum(treeIdx*2, curLeft, mid, targetLeft, targetRight)+getSum(treeIdx*2+1, mid+1, curRight, targetLeft, targetRight);
        }
    }

    void updateTree(int treeIdx, int start, int end, int targetIdx, int val) {
        if (start==end) {
            tree[treeIdx]=val;
            return;
        }
        
        int mid=(start+end)/2;
        if (targetIdx<=mid) {
            updateTree(treeIdx*2, start, mid, targetIdx, val);
        }
        else {
            updateTree(treeIdx*2+1, mid+1, end, targetIdx, val);
        }

        tree[treeIdx]=tree[treeIdx*2]+tree[treeIdx*2+1];
    };
};

// Time: O(log N) for update and sumRange, O(N) for buildTree
// Space: O(4N) for the tree
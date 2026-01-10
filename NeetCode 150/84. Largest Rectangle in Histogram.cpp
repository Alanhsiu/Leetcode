class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        // use monotonic stack
        // the stack stores the index of bars
        stack<int> s;
        int maxArea=0;

        // key details
        s.push(-1);
        heights.push_back(0);

        for(int i=0; i<heights.size(); ++i){
            while(s.top()!=-1 && heights[i]<=heights[s.top()]){
                int height=heights[s.top()];
                s.pop();
                
                int left=s.top();
                int width=(i-1)-left;
                maxArea=std::max(maxArea, width*height);
            }
            s.push(i);
        }

        return maxArea;
    }
};

// Time Complexity: O(N). Each bar is pushed and popped exactly once.
// Space Complexity: O(N). The stack can contain at most N elements.
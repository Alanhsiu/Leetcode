// This is the interface that allows for creating nested lists.
// You should not implement it, or speculate about its implementation
class NestedInteger {
  public:
    // Return true if this NestedInteger holds a single integer, rather than a nested list.
    bool isInteger() const;
    // Return the single integer that this NestedInteger holds, if it holds a single integer
    // The result is undefined if this NestedInteger holds a nested list
    int getInteger() const;
    // Return the nested list that this NestedInteger holds, if it holds a nested list
    // The result is undefined if this NestedInteger holds a single integer
    const vector<NestedInteger> &getList() const;
};


#include <vector>
#include <stack>
using namespace std;

class NestedIterator {
private:
    stack<NestedInteger> st;

public:
    NestedIterator(vector<NestedInteger> &nestedList) {
        for(int i=nestedList.size()-1; i>=0; --i){
            st.push(nestedList[i]);
        }
    }
    
    int next() {
        int top=st.top().getInteger();
        st.pop();
        return top;
    }
    
    bool hasNext() {
       while(!st.empty()){
            NestedInteger cur=st.top();
            if(cur.isInteger()){
                return true;
            }

            // if not
            st.pop();
            vector<NestedInteger> curList=cur.getList();
            for(int i=curList.size()-1; i>=0; --i){
                st.push(curList[i]);
            }
       }
       return false;
    }
};

/**
 * Your NestedIterator object will be instantiated and called as such:
 * NestedIterator i(nestedList);
 * while (i.hasNext()) cout << i.next();
 */

 // Time Complexity: O(1) amortized for next() and hasNext()
 // Space Complexity: O(D) where D is the maximum depth of the nested list

 // Another possible approach is dfs (to flatten the entire list in the constructor)
 // but that would use O(N) space where N is the total number of integers in the nested list.
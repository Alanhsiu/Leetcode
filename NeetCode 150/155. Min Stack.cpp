#include <stack>
using namespace std;

class MinStack {
public:
    stack<int> s1;
    stack<int> s2;
    MinStack() {}
    
    void push(int val) {
        s1.push(val);
        if(s2.empty() || s2.top()>=val){
            s2.push(val);
        }
    }
    
    void pop() {
        if(s2.top()==s1.top()){
            s2.pop();
        }
        s1.pop();
    }
    
    int top() {
        return s1.top();
    }
    
    int getMin() {
        return s2.top();
    }
};

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack* obj = new MinStack();
 * obj->push(val);
 * obj->pop();
 * int param_3 = obj->top();
 * int param_4 = obj->getMin();
 */

// Time: O(1) for all operations
// Space: O(n) for the two stacks, where n is the number of elements in the MinStack
// Definition for singly-linked list.
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* dummyNode = new ListNode(0);
        ListNode* current=dummyNode;
        int carry=0;

        while(l1 || l2 || carry){
            int val1 = l1 ? l1->val : 0;
            int val2 = l2 ? l2->val : 0;
            int sum=val1+val2+carry;
            carry=sum/10;
            sum%=10;
            current->next=new ListNode(sum);
            l1= l1 ? l1->next : nullptr;
            l2= l2 ? l2->next : nullptr;
            current=current->next;
        }
    
        ListNode* res=dummyNode->next;
        delete dummyNode;
        return res;
    }
};

// Time: O(max(M,N))
// Space: O(max(M,N))
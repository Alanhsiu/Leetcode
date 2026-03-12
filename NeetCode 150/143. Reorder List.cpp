
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
    void reorderList(ListNode* head) {
        if(!head || !head->next){
            return;
        }
        ListNode* slow=head;
        ListNode* fast=head->next;

        // find mid
        // slow: 1 2
        // fast: 2 4
        while(fast && fast->next){
            slow=slow->next;
            fast=fast->next->next;
        }

        ListNode* pre=nullptr;
        ListNode* cur=slow->next;
        ListNode* nxt=cur->next;

        slow->next=nullptr;
        while(nxt){
            cur->next=pre;
            pre=cur;
            cur=nxt;
            nxt=nxt->next;
        }
        cur->next=pre;

        ListNode* list1=head;
        ListNode* list2=cur;
        ListNode* tmp1;
        ListNode* tmp2;

        while(list2){
            tmp1=list1->next;
            tmp2=list2->next;
            list1->next=list2;
            list2->next=tmp1;
            list1=tmp1;
            list2=tmp2;
        }
    }
};


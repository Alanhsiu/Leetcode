/**
* Definition for singly-linked list.
* struct ListNode {
*     int val;
*     ListNode *next;
*     ListNode() : val(0), next(nullptr) {}
*     ListNode(int x) : val(x), next(nullptr) {}
*     ListNode(int x, ListNode *next) : val(x), next(next) {}
* };
*/
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head); 
        ListNode* tmp=head;
        int total=0;

        while(tmp){
            ++total;
            tmp=tmp->next;
        }

        tmp=&dummy;
        int target=total-n;

        for(int i=0; i<target; i++) // prev node of target
            tmp=tmp->next;
        
        if(tmp->next){
            ListNode* to_delete=tmp->next;
            tmp->next=tmp->next->next;
            delete to_delete;
        }

        return dummy.next;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
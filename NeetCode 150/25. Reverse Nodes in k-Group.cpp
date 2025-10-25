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
    ListNode* reverseKGroup(ListNode* head, int k) {
        if(k<=1)
            return head;

        ListNode dummyNode(0, head);
        
        ListNode* group_start=&dummyNode;
        ListNode* group_end=head;

        int count=0;
        while(group_end){
            group_end=group_end->next;
            ++count;

            if(count%k==0){
                ListNode* group_start_next=group_start->next;
                ListNode* new_group_start=reverseAGroup(group_start->next, k);
                group_start->next=new_group_start;
                group_start=group_start_next;
                group_start->next=group_end;
            }
        }

        return dummyNode.next;
    }

    ListNode* reverseAGroup(ListNode* head, int k) {
        ListNode* prev=nullptr;
        ListNode* cur=head;
        ListNode* next_node=nullptr;

        for(int i=0; i<k; ++i) {
            next_node=cur->next;
            cur->next=prev;
            prev=cur;
            cur=next_node;
        }

        return prev;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)
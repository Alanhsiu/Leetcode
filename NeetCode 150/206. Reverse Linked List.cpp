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
    ListNode* reverseList(ListNode* head) {
        // Taking 3 nodes to store the nodes.
        ListNode* cur = head;
        ListNode* prev = NULL;
        ListNode* next = NULL; 

        // reversing the linked list
        // 1->2->3->4->5 to 5->4->4->3->2->1

        while(cur){
            next = cur->next;
            cur->next = prev; 
            prev = cur;
            cur = next;
        }
        return prev;
    }
};

// Time Complexity: O(N)
// Space Complexity: O(1)